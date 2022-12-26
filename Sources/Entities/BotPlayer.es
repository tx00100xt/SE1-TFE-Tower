3003
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/Player";

class CBotPlayer: CPlayer {
name      "BotPlayer";
thumbnail "";

properties:
components:
functions:
procedures:
	Main()
	{
		CPrintF("Created player\n");
		InitializePlayer();
		CPrintF("Bye bye player\n");

		return;
	}
};
