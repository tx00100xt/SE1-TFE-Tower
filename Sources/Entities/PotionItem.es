808
%{
#include "Entities/StdH/StdH.h"
#include "Models/Items/ItemHolder/ItemHolder.h"
%}

uses "Entities/Item";

// potion type 
enum PotionItemType {
  0 PTN_RAGE    "Rage",         // Potion of Rage, doubles damage
  1 PTN_REGEN   "Regeneration", // potion of regeneration
};

// event for sending through receive item
event EPotion {
	enum PotionItemType iPotion,  // the potion that was received
	FLOAT fPotionTime, // how long the potion lasts
};

class CPotionItem : CItem {
name      "Potion Item";
thumbnail "Thumbnails\\PotionItem.tbn";

properties:
  1 enum PotionItemType m_EPotType    "Type" 'Y' = PTN_RAGE,     // potion type
  2 FLOAT m_fPotionTime    "Time" 'T' = 45.0f, // how long the potion lasts
  3 INDEX m_iSoundComponent = 0,

components:
  0 class   CLASS_BASE        "Classes\\Item.ecl",

// ********* POTION OF RAGE *********
  1 model   MODEL_RAGE        "Models\\Items\\Potions\\Bottle.mdl",
  2 texture TEXTURE_RAGE      "Models\\Items\\Potions\\Rage.tex",
  3 texture TEXTURE_REGEN	  "Models\\Items\\Potions\\Regeneration.tex",

// ********* MISC *************
 52 texture TEXTURE_REFLECTION_LIGHTMETAL01 "Models\\ReflectionTextures\\LightMetal01.tex",
 51 texture TEXTURE_SPECULAR_MEDIUM "Models\\SpecularTextures\\Medium.tex",

// ************** SOUNDS **************
301 sound   SOUND_RAGE         "Sounds\\Items\\PotionRageScream.wav",

functions:
  void Precache(void) {
    switch (m_EPotType) {
      case PTN_RAGE:   PrecacheSound(SOUND_RAGE  ); break;
    }
  }
  /* Fill in entity statistics - for AI purposes only */
  BOOL FillEntityStatistics(EntityStats *pes)
  {
    pes->es_strName = "Potion"; 
    pes->es_ctCount = 1;
    pes->es_ctAmmount = m_fValue;
    pes->es_fValue = m_fValue;
    pes->es_iScore = 0;//m_iScore;
    
    switch (m_EPotType) {
      case PTN_RAGE:  pes->es_strName+=" of Rage";   break;
	  case PTN_REGEN: pes->es_strName+=" of Regeneration"; break;
    }

    return TRUE;
  }

  // render particles
  void RenderParticles(void) {
    // no particles when not existing or in DM modes
    if (GetRenderType()!=CEntity::RT_MODEL || GetSP()->sp_gmGameMode>CSessionProperties::GM_COOPERATIVE
      || !ShowItemParticles())
    {
      return;
    }

    Particles_Stardust(this, 1.0f*0.75f, 0.75f*0.75f, PT_STAR08, 128);
  }

  // set player properties depending on potion type
  void SetProperties(void) {
    StartModelAnim(ITEMHOLDER_ANIM_SMALLOSCILATION, AOF_LOOPING|AOF_NORESTART);
    ForceCollisionBoxIndexChange(ITEMHOLDER_COLLISION_BOX_MEDIUM);
    switch (m_EPotType) {
      case PTN_RAGE:
        m_fValue = 120.0f;
        m_fRespawnTime = 120.0f;
        m_strDescription.PrintF("Rage - H:%g  T:%g", m_fValue, m_fRespawnTime);
        // set appearance
        AddItem(MODEL_RAGE, TEXTURE_RAGE, TEXTURE_REFLECTION_LIGHTMETAL01, TEXTURE_SPECULAR_MEDIUM, 0);
        StretchItem(FLOAT3D(1.5f*0.75f, 1.5f*0.75f, 1.5f*0.75));
        m_iSoundComponent = SOUND_RAGE;
        break;
	  case PTN_REGEN:
		m_fValue= 90.0f;
		m_fRespawnTime= 90.0f;
		m_strDescription.PrintF("Regeneration - H:%g T:%g", m_fValue, m_fRespawnTime);
		// set appearance
		AddItem(MODEL_RAGE, TEXTURE_REGEN, TEXTURE_REFLECTION_LIGHTMETAL01, TEXTURE_SPECULAR_MEDIUM, 0);
        StretchItem(FLOAT3D(1.5f*0.75f, 1.5f*0.75f, 1.5f*0.75));
		m_iSoundComponent = 0;
		break;
    }
  };

  void AdjustDifficulty(void)
  {
		// not applicable
  }

procedures:
  ItemCollected(EPass epass) : CItem::ItemCollected
  {
	  // if potion stays
	  if(GetSP()->sp_bHealthArmorStays && !m_bPickupOnce)
	  {
		  // if already picked by this player
		  BOOL bWasPicked= MarkPickedBy(epass.penOther);
		  if(bWasPicked)
		  {
			  return;  // don't pick again
		  }
	  }

	  EPotion ePotion;
	  ePotion.iPotion= m_EPotType;
	  ePotion.fPotionTime= m_fPotionTime;

	  if( epass.penOther->ReceiveItem(ePotion) )
	  {
		if(m_iSoundComponent)
		{
	      // play the pickup sound
          m_soPick.Set3DParameters(50.0f, 1.0f, 1.0f, 1.0f);
          PlaySound(m_soPick, m_iSoundComponent, SOF_3D);
          m_fPickSoundLen = GetSoundLength(m_iSoundComponent);
		}
        jump CItem::ItemReceived();
	  }

	  return;
  };

  Main() {
    Initialize();     // initialize base class
    SetProperties();  // set properties

    jump CItem::ItemLoop();
  };
};
