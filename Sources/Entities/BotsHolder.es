3000
%{
#include "Entities/StdH/StdH.h"
%}

%{
void CBotsHolder_OnInitClass(void)
{
	CDLLEntityClass *pdec = &CBotsHolder_DLLClass;

	pdec->PrecacheClass(CLASS_BOT_PLAYER);
}
%}

class CBotsHolder : CRationalEntity {
name		"BotsHolder";
thumbnail	"Thumbnails\\MusicHolder.tbn";
features "IsImportant", "ImplementsOnInitClass";

properties:
  1	INDEX		m_iMinimumPlayers		"Minimum Players"= 0,			// number of players; 0 means no bots
  2 INDEX		m_iWeaponsHere			"Weapons in this level"= 1,		// weapons in this level

  {
	  CEntityPointer pen_bot;
  }

components:
  1 model		MODEL_MARKER			"Models\\Editor\\MusicHolder.mdl",
  2 texture		TEXTURE_MARKER			"Models\\Editor\\MusicHolder.tex",

  3 class       CLASS_BOT_PLAYER        "Classes\\BotPlayer.ecl",

functions:
procedures:
	Main(EVoid)
	{
		// init as model
		InitAsEditorModel();
		SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
		SetCollisionFlags(ECF_IMMATERIAL);
		// set appearance
		SetModel(MODEL_MARKER);
		SetModelMainTexture(TEXTURE_MARKER);

		if(m_iMinimumPlayers==0) { return; }
		if(m_iMinimumPlayers>8) { m_iMinimumPlayers=8; }

		// wait for world to spawn
		autowait(0.1f);
		// [TEST]
		pen_bot= CreateEntity(GetPlacement(), CLASS_BOT_PLAYER);
		pen_bot->Initialize();

		return;
	} // end of main

};
