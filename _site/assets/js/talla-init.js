var appID = "00c26be3-4421-41e6-bb00-1dee68740f67"; 
// token for anonymous profile
var token =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1ODI4MDQzNDF9.RYf2x65FXvdDURzM h00i76KfUrYlsDLsw6mVuEv6zmE';
// -----
  Talla.config = Talla.init(
    appID,
    Talla.OptionJWTCredentials(token), 
    Talla.OptionBotName("Brightcove Player Doc Search"),
    Talla.OptionAnonymous(true),
    Talla.OptionThemeColor('rgb(43, 131, 223)'),
    Talla.OptionDisplayName('Search Brightcove Player Docs'),
    Talla.OptionKnowledgeGroups(['b2094e23-6070-4c72-91d2-9fba522c679a']),
    Talla.OptionWideBeacon(true),
    Talla.OptionBeaconCTA("Search Brightcove Player Docs"),
    Talla.OptionOpenIcon('https://learning-services-media.brightcove.com/doc-assets/site-assets/images/site/search.png'),
    Talla.OptionBotIcon('https://learning-services-media.brightcove.com/doc-assets/site-assets/images/site/search.png'),
    Talla.OptionAutodetectSession
  );
// configure to load up as custom placement
Talla.chat = Talla.config.configure(Talla.OptionLoadChat);
// function to load up the chat
 function displayChat() {
   Talla.chat.managedDisplay(Talla.OptionDetectParent(() => { return document.querySelector('#talla_chat')} ));
 }