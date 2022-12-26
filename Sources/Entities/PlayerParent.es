408
%{
#include "Entities/StdH/StdH.h"
%}

// this event is sent to PlayerParent when the player dies
// and the parent needs to be destroyed
event EPlayerDied {
};

class CPlayerParent: CRationalEntity {
name      "PlayerParent";
thumbnail "Thumbnails\\PlayerParent.tbn";
features  "HasName", "IsTargetable";

properties:
  1 CTString m_strName              "Name" 'N' = "PlayerParent",         // class name
  // not a single property require
  // boring, eh?

components:
  1 model   MODEL_HEAD     "Models\\Editor\\PlayerParent.mdl",
  2 texture TEXTURE_HEAD   "Models\\Editor\\PlayerParent.tex"

functions:                                        

procedures:
  DestroyAllSiblings() {
    FOREACHINLIST(CEntity, en_lnInParent, en_lhChildren, iten)
	{
      iten->SendEvent(EPlayerDied());
    }
	return;
  }

  Main() {
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    // set appearance
    SetModel(MODEL_HEAD);
    SetModelMainTexture(TEXTURE_HEAD);

    // spawn in world editor
    autowait(0.1f);

    // let's wait
	wait() {
	  on(EPlayerDied) : {
		call DestroyAllSiblings();
	    stop;
	  }

	  otherwise() : { resume; };
	};

    // if we got here
	// the player died
	// so we can delete ourselves
    Destroy();

    return;
  };
};
