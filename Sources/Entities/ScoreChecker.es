233
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/Player";
uses "Entities/TargetChanger";

class CScoreChecker: CRationalEntity
{
  name      "Score Checker";
  thumbnail "Thumbnails\\Trigger.tbn";
  features "HasName";

properties:
  1 CTString m_strName    "Name" 'N' = "Score Checker",         // class name

  2 CEntityPointer m_penTarget "Target" 'T',                    // what entity to target when scored
  3 enum EventEType m_eetEvent "Event Type" 'E' = EET_TRIGGER,  // what event to send
  4 FLOAT m_fReq "Score" 'S' = 50000,                           // which score will trigger this entity

components:
  1 model   MODEL_MARKER     "Models\\Editor\\Trigger.mdl",
  2 texture TEXTURE_MARKER   "Models\\Editor\\Camera.tex"

functions:
  // none

procedures:
  // found score, exiting
  Done()
  {
	  Destroy();
	  return;
  }

  // main loop
  // in case I want to implement an active/inactive mode
  Active()
  {
    while(TRUE)	{
	  wait(1) {
		on (ETimer): {
	      INDEX iMaxPlayers = CEntity::GetMaxPlayers();
	      CPlayer* OnePlayer;

	      // loop through all players and check their score
		  for( INDEX i=0; i<iMaxPlayers; i++)
		  { // ignore non-existent players
			OnePlayer= (CPlayer*)CEntity::GetPlayerEntity(i);
            if( OnePlayer == NULL )
			{
			  continue;
			}

			// check to see if score is sufficient
			if( OnePlayer->m_psGameStats.ps_iScore >= m_fReq)
			{
			  SendToTarget(m_penTarget, m_eetEvent, this);  // we got ourselves a winner
			  jump Done();
			}

		  }

		  stop;
		}

	    // if required to change the target
	    on(EChangeTarget eChangeTarget): {
   	      m_penTarget= eChangeTarget.penNewTarget;
		  resume;
		}
	  
	  }
	}
  }
		  


  Main() {
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    // set appearance
    SetModel(MODEL_MARKER);
    SetModelMainTexture(TEXTURE_MARKER);

	// spawn in world editor
	autowait(0.1f);
	jump Active();

	Destroy();
	return;
  }
};
