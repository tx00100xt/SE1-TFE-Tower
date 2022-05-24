3002
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/BotMarker";

class CBotPathSplitter: CRationalEntity {
name      "BotPathSplitter";
thumbnail "Thumbnails\\Trigger.tbn";
features  "HasName", "IsTargetable";

properties:
  1 CTString	m_strName				"Name"= "BotPathSplitter",

  // each one of these can be set to a possible root
  // the bot will choose the one he needs most
  // a map should be a wire of markers and splitters
  2 CEntityPointer	m_penTarget1		"Possible Root 1",
  3 CEntityPointer	m_penTarget2		"Possible Root 2",
  4 CEntityPointer	m_penTarget3		"Possible Root 3",
  5 CEntityPointer	m_penTarget4		"Possible Root 4",
  6 CEntityPointer	m_penTarget5		"Possible Root 5",
  7 CEntityPointer	m_penTarget6		"Possible Root 6",
  8 CEntityPointer	m_penTarget7		"Possible Root 7",
  9 CEntityPointer	m_penTarget8		"Possible Root 8",

components:
  1 model		MODEL_MARKER			"Models\\Editor\\Trigger.mdl",
  2 texture		TEXTURE_MARKER			"Models\\Editor\\Camera.tex"

functions:
	// returns the first target of the required cause
	CEntityPointer FirstThatRequiresCause(enum MarkerCause mcCause)
	{
		INDEX maxValue= 0;
		CEntityPointer current= NULL;

		// if this is not null
		if(m_penTarget1!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget1)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget1)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget1;
					maxValue= ((CBotMarker*)&*m_penTarget1)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget2!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget2)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget2)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget2;
					maxValue= ((CBotMarker*)&*m_penTarget2)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget3!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget3)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget3)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget3;
					maxValue= ((CBotMarker*)&*m_penTarget3)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget4!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget4)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget4)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget4;
					maxValue= ((CBotMarker*)&*m_penTarget4)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget5!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget5)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget5)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget5;
					maxValue= ((CBotMarker*)&*m_penTarget5)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget6!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget6)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget6)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget6;
					maxValue= ((CBotMarker*)&*m_penTarget6)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget7!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget7)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget7)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget7;
					maxValue= ((CBotMarker*)&*m_penTarget7)->m_iValue;
				}
			}
		}

		// if this is not null
		if(m_penTarget8!=NULL)
		{
			// and this has the required cause
			if(	((CBotMarker*)&*m_penTarget8)->m_emcMarkerCause == mcCause )
			{
				// and higher value then last found
				if(((CBotMarker*)&*m_penTarget8)->m_iValue>maxValue)
				{
					// set it up as primary
					current= m_penTarget8;
					maxValue= ((CBotMarker*)&*m_penTarget8)->m_iValue;
				}
			}
		}

		return current;
	} // end of FirstThatRequiresCause

procedures:
	Main()
	{
		InitAsEditorModel();
		SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
		SetCollisionFlags(ECF_IMMATERIAL);

		// set appearance
		SetModel(MODEL_MARKER);
		SetModelMainTexture(TEXTURE_MARKER);

		// if one of these markers is bad
		// report error message
		if( (m_penTarget1!= NULL && !IsOfClass(m_penTarget1, "BotMarker")) ||
			(m_penTarget2!= NULL && !IsOfClass(m_penTarget2, "BotMarker")) ||
			(m_penTarget3!= NULL && !IsOfClass(m_penTarget3, "BotMarker")) ||
			(m_penTarget4!= NULL && !IsOfClass(m_penTarget4, "BotMarker")) ||
			(m_penTarget5!= NULL && !IsOfClass(m_penTarget5, "BotMarker")) ||
			(m_penTarget6!= NULL && !IsOfClass(m_penTarget6, "BotMarker")) ||
			(m_penTarget7!= NULL && !IsOfClass(m_penTarget7, "BotMarker")) ||
			(m_penTarget8!= NULL && !IsOfClass(m_penTarget8, "BotMarker")) )
		{
			WarningMessage("All targets of BotPathSplitter must point to bot markers");
		}

		return;
	} // end of main
};
