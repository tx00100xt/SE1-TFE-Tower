229
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/PlayerParent";
uses "Entities/Player";

class CDamager: CRationalEntity {
name      "Damager";
thumbnail "Thumbnails\\Damager.tbn";
features  "HasName", "IsTargetable";

properties:
  1 CTString m_strName          "Name" 'N' = "Damager",
  2 CTString m_strDescription = "",
  3 enum DamageType m_dmtType "Type" 'Y' = DMT_ABYSS,    // type of damage
  4 FLOAT m_fAmmount "Ammount" 'A' = 1000.0f,             // ammount of damage
  5 CEntityPointer m_penToDamage "Entity to Damage" 'E',  // entity to damage, NULL to damage the triggerer
  6 BOOL m_bDamageFromTriggerer "DamageFromTriggerer" 'S' = FALSE,  // make the triggerer inflictor of the damage

  7 BOOL m_bHeal "Healing" = FALSE, // whether damager should heal rather than hurt

components:
  1 model   MODEL_TELEPORT     "Models\\Editor\\Copier.mdl",
  2 texture TEXTURE_TELEPORT   "Models\\Editor\\Copier.tex",

functions:
  const CTString &GetDescription(void) const {
    return m_strDescription;
  }

	void HealTarget(CEntityPointer penCaused)
	{
	  if( !IsDerivedFromClass(penCaused, "Player") )
	  {
		return;
	  }

	  CPlayer* penPlayer= (CPlayer*)&*penCaused;

      // determine old and new health values
      FLOAT fHealthOld = penPlayer->GetHealth();
      FLOAT fHealthNew = fHealthOld + m_fAmmount;
      fHealthNew = ClampUp( fHealthNew, penPlayer->TopHealthInside());

      // if value can be changed
      if( ceil(fHealthNew) > ceil(fHealthOld)) {
        // receive it
        penPlayer->SetHealth(fHealthNew);
      }

	}		


procedures:
  Main()
  {
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    // set appearance
    SetModel(MODEL_TELEPORT);
    SetModelMainTexture(TEXTURE_TELEPORT);

    ((CTString&)m_strDescription).PrintF("%s:%g", 
      DamageType_enum.NameForValue(INDEX(m_dmtType)), m_fAmmount);

    while (TRUE) {
      // wait to someone trigger you and then damage it
      wait() {
        on (ETrigger eTrigger) : {

          CEntity *penInflictor = this;
          if (m_bDamageFromTriggerer) {
            penInflictor = eTrigger.penCaused;
          }

          if (m_penToDamage!=NULL) {
            InflictDirectDamage(m_penToDamage, penInflictor, 
              m_dmtType, m_fAmmount, 
              m_penToDamage->GetPlacement().pl_PositionVector, FLOAT3D(0,1,0));
          } else if (eTrigger.penCaused!=NULL) {
		    if(m_bHeal)
			{
				HealTarget(eTrigger.penCaused);
			}
			else
			{
				InflictDirectDamage(eTrigger.penCaused, penInflictor, 
					m_dmtType, m_fAmmount, 
					eTrigger.penCaused->GetPlacement().pl_PositionVector, FLOAT3D(0,1,0));
			}
          }
          stop;
        }

		// if attached player died
		on(EPlayerDied): { Destroy(); stop; }

        otherwise() : {
          resume;
        };
      };
      
      // wait a bit to recover
      autowait(0.1f);
    }
  }
};

