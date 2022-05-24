235
%{
#include "Entities/StdH/StdH.h"
%}

class CCrateBrush: CMovableBrushEntity {
	name "Crate Brush";
	thumbnail "Thumbnails\\MovingBrush.tbn";
	features  "HasName", "IsTargetable";

properties:
  1 CTString m_strName            "Name" 'N' = "CrateBrush",

 11 BOOL m_bDynamicShadows        "Dynamic shadows" = FALSE,

 20 BOOL m_bMoving = FALSE,           // the brush is moving
 21 FLOAT3D m_vDesiredTranslation = FLOAT3D(0,0,0),    // desired translation

 // moving limits
 30 FLOAT m_fXLimitSign = 0.0f,
 31 FLOAT m_fYLimitSign = 0.0f,
 32 FLOAT m_fZLimitSign = 0.0f,
 
 50 CEntityPointer m_penSound     "Movement Sound" 'S',  // sound to play while moving
 51 CSoundObject m_soSound,

 65 FLOAT m_fHealth             "Health" 'H' = -1.0f,    // health

components:

functions:
  // none

procedures:
  // autowaits for two seconds
  AutowaitTwosecs() {
	  autowait(0.2f);
  }

  MoveBrush(ETouch eTouch) {
    const FLOAT3D &vTarget = eTouch.penOther->GetPlacement().pl_PositionVector;
    const ANGLE3D &aTarget = eTouch.penOther->GetPlacement().pl_OrientationAngle;
    const FLOAT3D &vSource = GetPlacement().pl_PositionVector;
    const ANGLE3D &aSource = GetPlacement().pl_OrientationAngle;

    // set new translation
    m_vDesiredTranslation = (vTarget-vSource);

    // start moving the OTHER direction
    SetDesiredTranslation(-m_vDesiredTranslation);

	m_bMoving= TRUE;
	autowait(0.1f);
	m_bMoving= FALSE;
	ForceFullStop();

	return;
  }

  Main() { 
	// initialize as moving brush
	InitAsBrush();

	// SetPhysicsFlags(EPF_BRUSH_MOVING);
    // SetCollisionFlags(ECF_BRUSH);
    SetPhysicsFlags(EPF_MODEL_FIXED);
    SetCollisionFlags(ECF_MODEL_HOLDER);
    SetHealth(m_fHealth);

    // set dynamic shadows as needed
    if (m_bDynamicShadows) {
      SetFlags(GetFlags()&~ENF_ZONING|ENF_DYNAMICSHADOWS);
    } else {
      SetFlags(GetFlags()&~ENF_ZONING&~ENF_DYNAMICSHADOWS);
    }

	ForceFullStop();

	autowait(0.1f);

    wait() {
  	  on(EBegin): {
	    resume;
	  }
	  
	  on(ETouch eTouch): { // time to start moving
		// if a player is touch the brush, start moving
		if( IsOfClass(eTouch.penOther, "Player") && !m_bMoving ) {
		  call MoveBrush(eTouch);
		}
		resume;
	  } // end etouch

	  on(EBlock): {
        m_bMoving= TRUE;
        SetDesiredTranslation(m_vDesiredTranslation);
		call AutowaitTwosecs();
		m_bMoving= FALSE;

		resume;
	  }


	  otherwise () : { resume; }

	} // end wait
  
	// need to implement on EDeath
	return;
  }

};
