238
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/Projectile";
uses "Entities/Bullet";

enum AmmoUsedType {
  0 EMO_HITSCAN     "Bullet",      // normal hitscan bullet
  1 EMO_ROCKET		"Rocket",      // rocketlauncher rocket
  2 EMO_GRNLASER    "Green Laser", // player's laser
  3 EMO_BLULASER    "Blue Laser",  // biomech laser
  4 EMO_CRACKER     "Firecracker", // headless firecracker
  5 EMO_TWOBALL     "Two ball",    // kleer's twoball
};

%{
// precaching files
void CShooter_Precache(void)
{
  CDLLEntityClass *pdec = &CShooter_DLLClass;
  pdec->PrecacheClass(CLASS_BULLET);
}

void CShooter_OnInitClass(void)
{
  CShooter_Precache();
}
%}

class CShooter: CRationalEntity {
	name "Shooter";
	thumbnail "Thumbnails\\Explosion.tbn";
	features "IsTargetable", "HasName", "IsImportant", "ImplementsOnInitClass";

properties:
  1 CTString m_strName          "Name" 'N' = "Shooter",// class name
  2 enum AmmoUsedType m_emoType	"Type" 'E' = EMO_HITSCAN, // what kind of explosion
  3 BOOL m_bActive              "Active" 'V' = TRUE,     // starts in active/inactive state
  4 ANGLE3D m_aDirection        "Direction" 'D' = ANGLE3D(0,90,0),

 10 FLOAT m_fDamage             "Damage" 'D' = 0.0f,
 11 FLOAT m_fWait               "Waiting Time" 'W' = 0.0f,
 12 INDEX m_ctMaxTrigs			"Max Trigs" 'M' = 1,
 13 FLOAT m_fRange              "Range" 'R' = 500.f,

 30 CSoundObject m_soEffect,    // explosion special effect

{
  CEntity *penBullet;
}

components:
  1 model   MODEL_EXPLOSION         "Models\\Editor\\Explosion.mdl",
  2 texture TEXTURE_EXPLOSION       "Models\\Editor\\Explosion.tex",

  // the projectiles
  3 class   CLASS_BULLET            "Classes\\Bullet.ecl",

functions:

procedures:
  // shoots the projectile
  Shoot() {
	// wait if required
    if (m_fWait > 0.0f)
	{
      wait (m_fWait) {
        on (EBegin) : { resume; }
        on (ETimer) : { stop; }
        on (EDeactivate) : { pass; }
        otherwise(): { resume; }
      }
    }

    // if we're using a maximum amount of triggering, self destruct
    if(m_ctMaxTrigs>=0)
	{
	  m_ctMaxTrigs--;
	  if(m_ctMaxTrigs<0)
	  {
	    Destroy();
		return;
	  }
	}

	// time to shoot
	// choosing the appropriate ammunition
	switch(m_emoType) {
	case EMO_HITSCAN:
      CPlacement3D plBullet;
      FLOAT3D vDir;
	  AnglesToDirectionVector(m_aDirection, vDir);
	  
	  // CPrintF("%f %f %f\n", vDir(1), vDir(2), vDir(3));
	  plBullet.pl_OrientationAngle= ANGLE3D(0,0,0);
	  plBullet.pl_PositionVector= vDir;
	  plBullet.RelativeToAbsolute(GetPlacement());

	  penBullet= CreateEntity(plBullet, CLASS_BULLET);

	  EBulletInit eInit;
	  eInit.penOwner= this;
	  eInit.fDamage= m_fDamage;
	  penBullet->Initialize(eInit);
      ((CBullet&)*penBullet).CalcTarget(m_fRange);
      ((CBullet&)*penBullet).m_fBulletSize = 0.1f;
      // launch bullet
      ((CBullet&)*penBullet).LaunchBullet(TRUE, 1, TRUE);
      ((CBullet&)*penBullet).DestroyBullet();
	  break;

	/* case EMO_ROCKET:
	  break;

	case EMO_GRNLASER:
	  break;

	case EMO_BLULASER:
	  break;

	case EMO_CRACKER:
	  break;

	case EMO_TWOBALL:
	  break; */
	}

	return; // a job well done :D
  }


  // active state
  Active() {
	ASSERT(m_bActive);
	while(TRUE)
	{
	  wait()
	  {
		// if unactivated
		on(EDeactivate): {
          m_bActive= FALSE;
		  jump InActive();
		}

		on(ETrigger): {
		  call Shoot();
		  resume;
		}

        otherwise(): { resume; };
	  }; // end wait
	} // done with main loop

	autowait(0.1f);
  }

  // inactive state
  InActive() {
    ASSERT(!m_bActive);
    while (TRUE)
	{
      wait()
	  {
        // if activated
        on (EActivate): {
          // go to active state
          m_bActive = TRUE;
          jump Active();
        }

        otherwise(): { resume; };
      }; // done with wait
      
      // wait a bit to recover
      autowait(0.1f);
    } // done with main loop
  }


  Main() { 
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);
	
    // set appearance
    SetModel(MODEL_EXPLOSION);
    SetModelMainTexture(TEXTURE_EXPLOSION);

	// spawn in world editor
	autowait(0.1f);

	if(m_bActive)
	{
	  jump Active();
	}
	else
	{
	  jump InActive();
	}

	Destroy();
	return;
  }

};
