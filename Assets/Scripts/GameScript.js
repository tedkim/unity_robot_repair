var cols:int = 4; // 카드 그리드 열의 수
var rows:int = 4; // 카드 그리드 행의 수
var totalCards:int = 16;  // 16일 것이다. 그러나 나는 늘 숫자에 약했다.
var matchesNeededToWin:int = totalCards * 0.5; // 총 16장의 카드가 있다면, 승리를 위해서는 8개의 짝을 찾아야 한다. 
var matchesMade:int = 0; // 시작할 때, 플레이어는 아무런 짝도 찾지 못한 상태다.
var cardW:int = 100; // 각 카드의 넓이와 높이는 100픽셀이다. 
var cardH:int = 100;
var aCards:Array; // 이 행렬에서 생성한 모든 카드를 저장한다.
var aGrid:Array; // 섞여서 화면에 놓여질 카드를 저장한다.
var aCardsFlipped:ArrayList; // 플레이어가 뒤집은 두 장의 카드를 저장한다.
var playerCanClick:boolean; // 이 플래그를 통해 원하지 않을 때, 플레이어가 버튼을 클릭할 수 없게 만든다.
var playerHasWon:boolean = false; // 플레이어의 승리 여부를 저장한다. 처음에 거짓으로 시작해야 한다.


function Start()
{
	playerCanClick = true; // 플레이어가 플레이할 수 있게 해줘야 하지 않겠는가?
	// 행렬을 비어있는 리스트로 초기화한다: 
	aCards = new Array();
	aGrid = new Array();
	aCardsFlipped = new ArrayList();
  
	BuildDeck();
  
	for(i=0; i<rows; i++)
	{
		aGrid[i] = new Array(); // 인덱스 i에 빈 행렬을 만든다. 
      
		for(j=0; j<cols; j++)
		{
			var someNum:int = Random.Range(0,aCards.length);
			aGrid[i][j] = aCards[someNum];
			aCards.RemoveAt(someNum);
		}
	}
}



function OnGUI () 
{
	  GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height)); 
	  GUILayout.BeginHorizontal();
	  BuildGrid();

	  if(playerHasWon) 
		BuildWinPrompt(); 
				
	  GUILayout.EndHorizontal();
	  GUILayout.EndArea();
} 


function BuildWinPrompt()
{
	  var winPromptW:int = 100;
	  var winPromptH:int = 90;
	   
	  var halfScreenW:float = Screen.width/2;
	  var halfScreenH:float = Screen.height/2;
	   
	  var halfPromptW:int = winPromptW/2;
	  var halfPromptH:int = winPromptH/2;
   
	GUI.BeginGroup(Rect(halfScreenW-halfPromptW, 
		halfScreenH-halfPromptH, winPromptW, winPromptH));   
	GUI.Box (Rect (0,0,winPromptW,winPromptH), 
		"A Winner is You!!");
   
	if(GUI.Button(Rect(10,40,80,20),"Play Again"))
	{
		Application.LoadLevel("title");
	}
	
	GUI.EndGroup();
}



function BuildGrid()
{
	GUILayout.BeginVertical();
	GUILayout.FlexibleSpace();
	  
	for(i=0; i<rows; i++)
	{
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		
		for(j=0; j<cols; j++)
		{
			var card:Object = aGrid[i][j];
			var img:String;
		  
			if(card.isMatched)
			{ 
				img = "blank";
			}
			else
			{
				if(card.isFaceUp)
				{
					img = card.img;
				} 
				else  
				{
					img = card.img;
				}          
			}
	
			GUI.enabled = !card.isMatched;
			Debug.Log("**** 1 GUI.enabled : " + GUI.enabled);
			if(GUILayout.Button(Resources.Load(img),
			  GUILayout.Width(cardW)))
			{
				if(playerCanClick)
				{
					FlipCardFaceUp(card);
				}
				Debug.Log("$$$"+card.img);
				GUI.enabled = true;
				Debug.Log("**** 2 GUI.enabled : " + GUI.enabled);
			} 
		}
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal(); 
	}
	GUILayout.FlexibleSpace();
	GUILayout.EndVertical();
}


function FlipCardFaceUp(card:Card)
{
	card.isFaceUp = true;
  
	if(aCardsFlipped.IndexOf(card) < 0)
	{
		aCardsFlipped.Add(card);
	  
		if(aCardsFlipped.Count == 2)
		{
			playerCanClick = false;
				 
			yield WaitForSeconds(1);
		
			if(aCardsFlipped[0].id == aCardsFlipped[1].id)
			{
				// 짝이 맞았다!
				aCardsFlipped[0].isMatched = true;
				aCardsFlipped[1].isMatched = true;
		   
				matchesMade ++;
				
				if(matchesMade >= matchesNeededToWin )
				{
					playerHasWon = true;
				}
			}
			else 
			{
				aCardsFlipped[0].isFaceUp = false;
				aCardsFlipped[1].isFaceUp = false;	   
			}
			aCardsFlipped = new ArrayList(); 
			playerCanClick = true;
			
		}
	}
}




function BuildDeck()
{
	var totalRobots:int = 4;  // 4종의 로봇이 사용된다
	var card:Object; // 여기에 카드에 대한 참조를 저장한다
	var id:int = 0;
   
	for(i=0; i<totalRobots; i++)
	{
		var aRobotParts:Array = ["Head", "Arm", "Leg"];
		for(j=0; j<2; j++)
		{
			var someNum:int = Random.Range(0, aRobotParts.length);
			var theMissingPart:String = aRobotParts[someNum];
	   
			aRobotParts.RemoveAt(someNum);
		  
			card = new Card("robot" + (i+1) + "Missing" + theMissingPart,id);
			aCards.Add(card);
			 
			card= new Card("robot" + (i+1) + theMissingPart,id);
			aCards.Add(card); 
			
			id++;
			
		}   
	}
}



class Card extends System.Object
{
	var isFaceUp:boolean = false;
	var isMatched:boolean = false;
	var id:int;
	var img:String;
   
	function Card(img:String, id:int)
	{
		this.img = img;
		this.id = id;
	}
}
