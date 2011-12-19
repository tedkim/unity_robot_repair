var customSkin:GUISkin;

function OnGUI () {
  GUI.skin = customSkin;
  var buttonW:int = 100;
  var buttonH:int = 50;
  var halfScreenW:float = Screen.width/2;
  var halfButtonW:float = buttonW/2;
  if(GUI.Button(Rect(halfScreenW-halfButtonW,560,buttonW,buttonH),
      "Play"))
  {
    //print("You clicked me!");
	Application.LoadLevel("game");
  }
}
