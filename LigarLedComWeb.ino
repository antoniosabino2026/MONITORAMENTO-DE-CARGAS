#include <IRremote.hpp>

#include <WebServer.h>
#include <WiFi.h>
#include <LittleFS.h>


#define lampada 18
#define ir 34


//const char* rede = "iPhone 8Plus d’António Sabino";
const char* rede = "d3ma";
//const char* rede = "Meturiana";
//const char* rede = "Shadownigth Comercial SNC";

//const char* pass = "podeconectar_";
const char* pass = "12345678_";
//const char* pass = "podeconectar_";
//const char* pass = "00000000";

bool lampState = false;
WebServer server(80);

int c = 0;
void LigarLampada(){
  digitalWrite(lampada, HIGH);
}
void DesligarLampada(){
  digitalWrite(lampada, LOW);
}
  


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  pinMode(lampada, OUTPUT);
  digitalWrite(lampada, LOW);
  
  IrReceiver.begin(ir, ENABLE_LED_FEEDBACK);
  Serial.println("Sistema IR iniciado.");

  if (!LittleFS.begin(true)){
    Serial.println("Erro ao Iniciar o Servidor de Arquivos");
    return;
  }

  Serial.println("Arquivos encontrados no Servidor:");
  File root = LittleFS.open("/");
  File file = root.openNextFile();

   if (!file){
    Serial.println();
    Serial.println("Nenhum arquivo no servidor (~_;)");
    Serial.println();
  }
  
  while (file){
    c += 1;
    Serial.println();
    Serial.print(c);
    Serial.println("º arquivo");
    Serial.print("Nome: ");
    Serial.println(file.name());

    Serial.print("Tamanho: ");
    Serial.println(file.size());

    file = root.openNextFile();
  }
 
  Serial.println();
  Serial.println("Servidor de Arquivos Conectado");

  Serial.println("A conectar Wi-Fi...");
  WiFi.begin(rede, pass);

  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }  

  Serial.println("Wi-Fi Conectado com Sucesso!");
  Serial.println();

  Serial.print("IP do Servidor de Arquivos: ");
  Serial.println(WiFi.localIP());

  //ARQUIVO PRINCIPAL
  server.on("/", HTTP_GET, []() {
    File file = LittleFS.open("/index.html", "r");
    if(!file){
      server.send(404, "text/plain", "index.html não encontrado");
      return;
    }
    server.streamFile(file, "text/html");
    file.close();
  });

  server.on("/style.css", HTTP_GET, [](){
    File file = LittleFS.open("/style.css", "r");
    if (!file){
      server.send(404, "text/plain", "Folha CSS não encontrada");
      return;
    }
    server.streamFile(file, "text/css");
    file.close();
  });

  server.on("/script.js", HTTP_GET, [](){
    File file = LittleFS.open("/script.js", "r");
    if (!file){
      server.send(404, "text/plain", "JavaScript não encontrado");
      return;
    }
    server.streamFile(file, "application/css");
    file.close();
  });

    server.on("/api/state", HTTP_GET, [](){
      String json = "{";
      json += "\"lampState\":";
      json += lampState ? "true":"false";
      json += ",";
      json += "\"uptime\":";
      json += millis();
      json += "}";

      server.send(200, "application/json", json);

    });
    server.on("/api/lamp/off", HTTP_GET, [](){
      String json = "{";
      json += "\"lampState\":";
      json += lampState = false;
      json += "}";

      DesligarLampada();
      
      int estado = digitalRead(lampada);

      Serial.print("A lâmpada está OFF: ");
      Serial.println(estado);

      server.send(200, "application/json", json);
    });

    server.on("/api/lamp/on", HTTP_GET, [](){
      String json = "{";
      json += "\"lampState\":";
      json += lampState = true;
      json += "}";

      LigarLampada();

      int estado = digitalRead(lampada);

      Serial.print("A lâmpada está ON: ");
      Serial.println(estado);

      server.send(200, "application/json", json);
    });
  

  server.begin();
  Serial.println("Servidor HTTP iniciado.");

  Serial.println();
  Serial.println("=====================================");
  Serial.println("=========Aguardando Comandos=========");
  Serial.println("=====================================");

}



void loop() {
  // put your main code here, to run repeatedly:
  server.handleClient();

  //VERIFICAR E ATUALIZAR EM PRIMEIRA MÃO O JAVASCRIPT
  if (IrReceiver.decode()){
    if(IrReceiver.decodedIRData.protocol == NEC &&
    IrReceiver.decodedIRData.address == 0x1 &&
    IrReceiver.decodedIRData.command == 0x41){
      lampState = !lampState;

      if (lampState == true){
        LigarLampada();
      }else{
        DesligarLampada();
      }
    }
    delay(1000);
    IrReceiver.resume();

  }


}
