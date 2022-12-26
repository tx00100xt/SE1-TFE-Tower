237
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/BasicEffects";
uses "Entities/TargetChanger";

class CTeleportGeometry : CRationalEntity {
	name      "Teleport Geometry";
	thumbnail "Thumbnails\\Teleport.tbn";
	features  "HasName", "HasTarget", "IsTargetable", "IsImportant";

properties:
  1 CTString m_strName          "Name" 'N' = "Teleport",
  2 CEntityPointer m_penTarget  "Target" 'T' COLOR(C_BROWN|0xFF),
  3 BOOL m_bActive              "Active" 'A' = TRUE,
  4 BOOL m_bPlayerOnly          "Player Only" 'P'= TRUE,
  7 BOOL m_bTeleportEffect      "Teleport Effect" 'E'= TRUE,

{
  CFieldSettings m_fsField;
}

components:
  1 texture TEXTURE_TELEPORT   "Models\\Editor\\Teleport.tex",
  2 class   CLASS_BASIC_EFFECT  "Classes\\BasicEffect.ecl",

functions:
  // two maintanance functions
  void SetupFieldSettings(void) {
    m_fsField.fs_toTexture.SetData(GetTextureDataForComponent(TEXTURE_TELEPORT));
    m_fsField.fs_colColor = C_BLUE|CT_OPAQUE;
  }

  CFieldSettings *GetFieldSettings(void) {
    if (m_fsField.fs_toTexture.GetData()==NULL) {
      SetupFieldSettings();      
    }
    return &m_fsField;
  }
 
  // teleport the entering entity to the target
  void TeleportEntity(CEntity *pen, const CPlacement3D &pl)
  {
    CPrintF("Entering teleport sequence\n");
	// teleport back
    pen->Teleport(pl);

	if(m_bTeleportEffect)
	{
      // spawn teleport effect
      ESpawnEffect ese;
      ese.colMuliplier = C_WHITE|CT_OPAQUE;
      ese.betType = BET_TELEPORT;
      ese.vNormal = FLOAT3D(0,1,0);
      FLOATaabbox3D box;
      pen->GetBoundingBox(box);
      FLOAT fEntitySize = box.Size().MaxNorm()*2;
      ese.vStretch = FLOAT3D(fEntitySize, fEntitySize, fEntitySize);
      CEntityPointer penEffect = CreateEntity(pl, CLASS_BASIC_EFFECT);
      penEffect->Initialize(ese);
	}
  }

procedures:
  // this is a small dummy function, since wait statements cannot be nested
  // please note a wait is required, because otherwise the teleport sequence
  // is triggered multiple times- ending with a gibbed player
  SaveFromDeath() {
	  wait(0.1f)
	  {
		  on(ETimer): { stop; }
		  otherwise(): { resume; }
	  }
	  return;
  }

  Main() {
	InitAsFieldBrush();
	SetPhysicsFlags(EPF_BRUSH_FIXED);
    SetCollisionFlags( ((ECBI_MODEL)<<ECB_TEST) | ((ECBI_BRUSH)<<ECB_IS) | ((ECBI_MODEL)<<ECB_PASS) );

	wait() {
	  on (EPass ePass): {
        if (m_penTarget!=NULL && m_bActive) {
		  if(m_bPlayerOnly) {
		    if(!IsDerivedFromClass(m_penTarget, "Player")) {
			  TeleportEntity(ePass.penOther, m_penTarget->GetPlacement());
			  call SaveFromDeath();
			}
		  }
		  else
		  {
			TeleportEntity(ePass.penOther, m_penTarget->GetPlacement());
			call SaveFromDeath();
		  }		
        }
        resume;
      }

      on (EActivate): {
        m_bActive = TRUE;
        resume;
	  }
      
	  on (EDeactivate): {
        m_bActive = FALSE;
        resume;
      }

	  // if required to change the target
	  on(EChangeTarget eChangeTarget): {
   	    m_penTarget= eChangeTarget.penNewTarget;
	    resume;
	  }

      otherwise() : { resume; }
	}

	return;
  }
};
