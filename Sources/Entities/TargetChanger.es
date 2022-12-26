236
%{
#include "Entities/StdH/StdH.h"
%}

event EChangeTarget {
  CEntityPointer penNewTarget, // what's the new target
};

class CTargetChanger: CRationalEntity {
	name "Target Changer";
	thumbnail "Thumbnails\\TargetChanger.tbn";
	features "IsTargetable", "HasName";

properties:
  1 CTString m_strName              "Name" 'N' = "Target Changer",          // class name

  3 CEntityPointer m_penTarget      "Target Entity" 'T', // what entity to change
  4 CEntityPointer m_penNew         "New target" 'N', // what's the new target

components:
  1 model   MODEL_MARKER     "Models\\Editor\\Trigger.mdl",
  2 texture TEXTURE_MARKER   "Models\\Editor\\Camera.tex"

functions:
procedures:
  Main() {
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    // set appearance
    SetModel(MODEL_MARKER);
    SetModelMainTexture(TEXTURE_MARKER);

	wait() {
		on(EBegin): { resume; }
		on(ETrigger): {  // just send the appropriate event
		  EChangeTarget eChangeTarget;
		  eChangeTarget.penNewTarget= m_penNew;
		  m_penTarget->SendEvent(eChangeTarget);
		  resume;
		}

	    // if required to change the target
	    on(EChangeTarget eChangeTarget): {
   	      m_penTarget= eChangeTarget.penNewTarget;
		  resume;
		}

        otherwise(): { resume; }
	}

	return;
  }

};
