3001
%{
#include "Entities/StdH/StdH.h"
%}

uses "Entities/Marker";
uses "Entities/BotPathSplitter";

// the cause this marker exists
// where does it lead to
enum MarkerCause
{
	0 MC_NOWHERE			"Not applicable",	// this marker doesn't lead anywhere

	// this marker leads to a specific weapon
	1 MC_COLT				"Weapon: Colt*",
	2 MC_SINGLESHOTGUN		"Weapon: Single Shotgun*",
	3 MC_DOUBLESHOTGUN		"Weapon: Double Shotgun*",
	4 MC_TOMMYGUN			"Weapon: Tommygun*",
	5 MC_MINIGUN			"Weapon: Minigun*",
	6 MC_ROCKETLAUNCHER		"Weapon: Rocket Launcher*",
	7 MC_GREANDELAUNCHER	"Weapon: Grenade Launcher*",
	8 MC_SPIKEBALLLAUNCHER	"Weapon: Spikeball Launcher*",
	9 MC_LASER				"Weapon: Laser*",
   10 MC_IRONCANNON			"Weapon: Cannon*",

    // this marker leads to ammunition
   11 MC_AMMO_SHELLS		"Ammo: Shells*",
   12 MC_AMMO_BULLETS		"Ammo: Bullets*",
   13 MC_AMMO_ROCKETS		"Ammo: Rockets*",
   14 MC_AMMO_GRENADES		"Ammo: Grenades*",
   15 MC_AMMO_SPIKEBALLS	"Ammo: Spikeballs*",
   16 MC_AMMO_ELECTRICITY	"Ammo: Electricity*",
   17 MC_AMMO_CANNONBALLS	"Ammo: Cannonballs*",

    // this marker leads to a potion
   20 MC_POTION_RAGE		"Potion: Rage*",
   21 MC_POTION_REGEN		"Potion: Regeneration*",

    // this marker leads to health
   30 MC_HEALTH				"Health: Normal*",
   31 MC_HEALTH_PILL		"Health: Pills*",
   32 MC_HEALTH_HEART		"Health: Heart*",

    // this marker leads to armor
   40 MC_ARMOR				"Armor: Normal*",
   41 MC_ARMOR_SUPER		"Armor: Super*",
};

class CBotMarker: CMarker {
name      "BotMarker";
thumbnail "Thumbnails\\EnemyMarker.tbn";

properties:
  1 enum MarkerCause m_emcMarkerCause	"Cause"= MC_NOWHERE,
  2 INDEX		m_iValue				"Value"= 1,
  3 FLOAT		m_fTemp					"TEMP VALUE"= 0,

components:
  1 model		MODEL_MARKER			"Models\\Editor\\EnemyMarker.mdl",
  2 texture		TEXTURE_MARKER			"Models\\Editor\\EnemyMarker.tex"

functions:
	/* Check if entity can drop marker for making linked route. */
	BOOL DropsMarker(CTFileName &fnmMarkerClass, CTString &strTargetProperty) const
	{
		fnmMarkerClass = CTFILENAME("Classes\\BotMarker.ecl");
		strTargetProperty = "Target";
		return TRUE;
	} // end of DropsMarker

	// returns true if this is the final destination of a chain of markers
	BOOL FinalDestination()
	{
		return (m_penTarget==NULL);
	} // end of FinalDestination

    // returns the distance of this marker from the next one
	FLOAT DistanceFromNext()
	{
		if(FinalDestination()) { return 0; }

		return (m_penTarget->GetPlacement().pl_PositionVector -
			    GetPlacement().pl_PositionVector).Length();
	} // end of DistanceFromNext

	// returns the distance of this marker from the final marker
	FLOAT DistanceFromLast()
	{
		CEntityPointer current= this;
		FLOAT finalDistance=0;

		while(m_penTarget!=NULL)
		{
			// if this is a splitter
			if(IsDerivedFromClass(current, "BotPathSplitter"))
			{
				// update to the best possible marker
				current= ((CBotPathSplitter*)&*current)->FirstThatRequiresCause(m_emcMarkerCause);

				// bad, bad user
				if(current==NULL)
				{ // why does this trigger?!?!
					WarningMessage("Mustn't have BotPathSplitter as last on chain!\n");
					return finalDistance;
				}
			}

			// mask it to a comfortable marker
			CBotMarker* currentMarker= (CBotMarker*)&*current;
			// if this is the final destination, return the distance achieved so far

			// [TEST] I believe this line is troublesome
			// maybe the casting is wrong?
			if(currentMarker->FinalDestination()) { return finalDistance; }	

			// otherwise
			finalDistance+= currentMarker->DistanceFromNext();	// update the distance
			current= currentMarker->m_penTarget;				// move to next marker
		}

		// in case m_penTarget==NULL
		return finalDistance;
	} // end of DistanceFromLast

procedures:
	Main()
	{
		InitAsEditorModel();
		SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
		SetCollisionFlags(ECF_IMMATERIAL);

		// set appearance
		SetModel(MODEL_MARKER);
		SetModelMainTexture(TEXTURE_MARKER);

		m_fTemp= DistanceFromLast();

		// wait for world to spawn
		autowait(0.1f);

		// display error message for empty marker
		if(m_emcMarkerCause==MC_NOWHERE)
		{
			CPrintF("Error! Null bot marker detected, %s", GetName());
		}

		return;
	} // end of main
};

