package battlecode.common;

import java.util.Map;

/**
 * A RobotController allows contestants to make their robot sense and interact
 * with the game world. When a contestant's <code>RobotPlayer</code> is
 * constructed, it is passed an instance of <code>RobotController</code> that
 * controls the newly created robot.
 */
@SuppressWarnings("unused")
public strictfp interface RobotController {

    // *********************************
    // ****** GLOBAL QUERY METHODS *****
    // *********************************

    /**
     * Returns the current round number, where round 1 is the first round of the
     * match.
     *
     * @return the current round number, where round 1 is the first round of the
     * match
     *
     * @battlecode.doc.costlymethod
     */
    int getRoundNum();

    /**
     * Returns the width of the game map. Valid x coordinates range from
     * 0 (inclusive) to the width (exclusive).
     *
     * @return the map width
     *
     * @battlecode.doc.costlymethod
     */
    int getMapWidth();

    /**
     * Returns the height of the game map. Valid y coordinates range from
     * 0 (inclusive) to the height (exclusive).
     *
     * @return the map height
     *
     * @battlecode.doc.costlymethod
     */
    int getMapHeight();

    // *********************************
    // ****** UNIT QUERY METHODS *******
    // *********************************

    /**
     * Returns the ID of this robot.
     *
     * @return the ID of this robot
     *
     * @battlecode.doc.costlymethod
     */
    int getID();

    /**
     * Returns this robot's Team.
     *
     * @return this robot's Team
     *
     * @battlecode.doc.costlymethod
     */
    Team getTeam();

    /**
     * Returns this robot's current location.
     *
     * @return this robot's current location
     *
     * @battlecode.doc.costlymethod
     */
    MapLocation getLocation();

    /**
     * Returns this robot's current health.
     *
     * @return this robot's current health
     *
     * @battlecode.doc.costlymethod
     */
    int getHealth();

    /**
     * Returns the robot's current experience in the specified skill.
     * 
     * @param skill the skill that we want to get the robot's experience in
     * @return the robot's experience in the skill
     * 
     * @battlecode.doc.costlymethod
     */
    int getExperience(SkillType skill);

    /**
     * Returns the robot's current level in the specified skill.
     * 
     * @param skill the skill that we want to get the robot's level in
     * @return the robot's level in the skill
     * 
     * @battlecode.doc.costlymethod
     */
    int getLevel(SkillType skill);

    /**
     * Returns the amount of crumbs that this robot's team has.
     *
     * @return the amount of crumbs this robot's team has
     *
     * @battlecode.doc.costlymethod
     */
    int getCrumbs();

    // ***********************************
    // ****** GENERAL VISION METHODS *****
    // ***********************************

    /**
     * Checks whether a MapLocation is on the map. 
     *
     * @param loc the location to check
     * @return true if the location is on the map; false otherwise
     *
     * @battlecode.doc.costlymethod
     */
    boolean onTheMap(MapLocation loc);

    /**
     * Checks whether the given location is within the robot's vision range, and if it is on the map.
     *
     * @param loc the location to check
     * @return true if the given location is within the robot's vision range and is on the map; false otherwise
     *
     * @battlecode.doc.costlymethod
     */
    boolean canSenseLocation(MapLocation loc);

    /**
     * Checks whether a robot is at a given location. Assumes the location is valid.
     *
     * @param loc the location to check
     * @return true if a robot is at the location
     * @throws GameActionException if the location is not within vision range or on the map
     *
     * @battlecode.doc.costlymethod
     */
    boolean isLocationOccupied(MapLocation loc) throws GameActionException;

    /**
     * Checks whether a robot is at a given location. Assume the location is valid.
     *
     * @param loc the location to check
     * @return true if a robot is at the location, false if there is no robot or the location can not be sensed
     *
     * @battlecode.doc.costlymethod
     */
    boolean canSenseRobotAtLocation(MapLocation loc);

    /**
     * Senses the robot at the given location, or null if there is no robot
     * there.
     *
     * @param loc the location to check
     * @return the robot at the given location
     * @throws GameActionException if the location is not within vision range
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo senseRobotAtLocation(MapLocation loc) throws GameActionException;

    /**
     * Tests whether the given robot exists and if it is within this robot's
     * vision range.
     *
     * @param id the ID of the robot to query
     * @return true if the given robot is within this robot's vision range and exists;
     * false otherwise
     *
     * @battlecode.doc.costlymethod
     */
    boolean canSenseRobot(int id);

    /**
     * Senses information about a particular robot given its ID.
     *
     * @param id the ID of the robot to query
     * @return a RobotInfo object for the sensed robot
     * @throws GameActionException if the robot cannot be sensed (for example,
     * if it doesn't exist or is out of vision range)
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo senseRobot(int id) throws GameActionException;

    /**
     * Returns all robots within vision radius. The objects are returned in no
     * particular order.
     *
     * @return array of RobotInfo objects, which contain information about all
     * the robots you saw
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo[] senseNearbyRobots();

    /**
     * Returns all robots that can be sensed within a certain distance of this
     * robot. The objects are returned in no particular order.
     *
     * @param radiusSquared return robots this distance away from the center of
     * this robot; if -1 is passed, all robots within vision radius are returned;
     * if radiusSquared is larger than the robot's vision radius, the vision
     * radius is used
     * @return array of RobotInfo objects of all the robots you saw
     * @throws GameActionException if the radius is negative (and not -1)
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo[] senseNearbyRobots(int radiusSquared) throws GameActionException;

    /**
     * Returns all robots of a given team that can be sensed within a certain
     * distance of this robot. The objects are returned in no particular order.
     *
     * @param radiusSquared return robots this distance away from the center of
     * this robot; if -1 is passed, all robots within vision radius are returned;
     * if radiusSquared is larger than the robot's vision radius, the vision
     * radius is used
     * @param team filter game objects by the given team; if null is passed,
     * robots from any team are returned
     * @return array of RobotInfo objects of all the robots you saw
     * @throws GameActionException if the radius is negative (and not -1)
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo[] senseNearbyRobots(int radiusSquared, Team team) throws GameActionException;

    /**
     * Returns all robots of a given team that can be sensed within a certain
     * radius of a specified location. The objects are returned in no particular
     * order.
     *
     * @param center center of the given search radius
     * @param radiusSquared return robots this distance away from the center of
     * this robot; if -1 is passed, all robots within vision radius are returned;
     * if radiusSquared is larger than the robot's vision radius, the vision
     * radius is used
     * @param team filter game objects by the given team; if null is passed,
     * objects from all teams are returned
     * @return array of RobotInfo objects of the robots you saw
     * @throws GameActionException if the radius is negative (and not -1) or the center given is null
     *
     * @battlecode.doc.costlymethod
     */
    RobotInfo[] senseNearbyRobots(MapLocation center, int radiusSquared, Team team) throws GameActionException;

    /**
     * Returns all locations that contain crumbs within a certain radius of the robot.
     * 
     * @param radiusSquared return crumbs within this distance; if -1 is passed, all crumbs within
     * vision radius are returned
     * @return array of MapLocations of crumbs
     * @throws GameActionException if the radius is negative and not -1
     */
    MapLocation[] senseNearbyCrumbs(int radiusSquared) throws GameActionException;

    /**
     * Given a location, returns whether that location is passable (not water, a wall, or a dam).
     * 
     * @param loc the given location
     * @return whether that location is passable
     * @throws GameActionException if the robot cannot sense the given location
     *
     * @battlecode.doc.costlymethod
     */
    boolean sensePassability(MapLocation loc) throws GameActionException;

    /**
     * Senses the map info at a location. MapInfo includes walls, spawn zones, water, crumbs, and friendly traps.
     *
     * @param loc to sense map at
     * @return MapInfo describing map at location
     * @throws GameActionException if location can not be sensed
     *
     * @battlecode.doc.costlymethod
     */
    MapInfo senseMapInfo(MapLocation loc) throws GameActionException;

    /**
     * Return map info for all senseable locations. 
     * MapInfo includes walls, spawn zones, water, crumbs, and friendly traps.
     *
     * @return MapInfo about all locations within vision radius
     *
     * @battlecode.doc.costlymethod
     */
    MapInfo[] senseNearbyMapInfos();

    /**
     * Return map info for all senseable locations within a radius squared. 
     * If radiusSquared is larger than the robot's vision radius, uses the robot's
     * vision radius instead. If -1 is passed, all locations within vision radius
     * are returned.
     * MapInfo includes walls, spawn zones, water, crumbs, and friendly traps.
     *
     * @param radiusSquared the squared radius of all locations to be returned
     * @return MapInfo about all locations within vision radius
     * @throws GameActionException if the radius is negative (and not -1)
     *
     * @battlecode.doc.costlymethod
     */
    MapInfo[] senseNearbyMapInfos(int radiusSquared) throws GameActionException;

    /**
     * Return map info for all senseable locations within vision radius of a center location. 
     * MapInfo includes walls, spawn zones, water, crumbs, and friendly traps.
     *
     * @param center the center of the search area
     * @return MapInfo about all locations within vision radius
     * @throws GameActionException if center is null
     *
     * @battlecode.doc.costlymethod
     */
    MapInfo[] senseNearbyMapInfos(MapLocation center) throws GameActionException;

    /**
     * Return map info for all senseable locations within a radius squared of a center location. 
     * If radiusSquared is larger than the robot's vision radius, uses the robot's
     * vision radius instead. If -1 is passed, all locations within vision radius
     * are returned.
     * MapInfo includes walls, spawn zones, water, crumbs, and friendly traps.
     *
     * @param center the center of the search area
     * @param radiusSquared the squared radius of all locations to be returned
     * @return MapInfo about all locations within vision radius
     * @throws GameActionException if the radius is negative (and not -1)
     *
     * @battlecode.doc.costlymethod
     */
    MapInfo[] senseNearbyMapInfos(MapLocation center, int radiusSquared) throws GameActionException;

    /**
     * Returns the location of all nearby flags that are visible to the robot, including picked up flags.
     * If radiusSquared is greater than the robot's vision radius, uses the robot's vision radius instead.
     * 
     * @param radiusSquared squared radius of all locations to be returned, -1 for max radius
     * @return all locations containing flags
     * @throws GameActionException if a radius less than -1 is provided
     * 
     * @battlecode.doc.costlymethod
     **/
    FlagInfo[] senseNearbyFlags(int radiusSquared) throws GameActionException; 

    /**
     * Returns the location of all nearby flags that are visible to the robot, including picked up flags.
     * If radiusSquared is greater than the robot's vision radius, uses the robot's vision radius instead.
     * 
     * @param radiusSquared squared radius of all locations to be returned
     * @param team the team to find flags for
     * @return all locations containing flags
     * @throws GameActionException if a radius less than -1 is provided
     * 
     * @battlecode.doc.costlymethod
     **/
    FlagInfo[] senseNearbyFlags(int radiusSquared, Team team) throws GameActionException; 

    /**
     * Returns the locations of all invisible dropped enemy flags, accurate within a radius of sqrt(100) cells.
     * 
     * @return all location ranges containing invisible flags
     * 
     * @battlecode.doc.costlymethod
     **/
    MapLocation[] senseBroadcastFlagLocations();

    /**
     * Checks if the given location within vision radius is a legal starting flag placement. This is true when the
     * location is in range, is passable, and is far enough away from other placed friendly flags. Note that if the third
     * condition is false, the flag can still be placed but will be teleported back to the spawn zone at the end of the
     * setup phase.
     * 
     * @param loc The location to check
     * @return Whether the location is a valid flag placement
     * @throws GameActionException if the location is out of sensing range
     * 
     * @battlecode.doc.costlymethod
     */
    boolean senseLegalStartingFlagPlacement(MapLocation loc) throws GameActionException;

    /**
     * Returns the location adjacent to current location in the given direction.
     *
     * @param dir the given direction
     * @return the location adjacent to current location in the given direction
     *
     * @battlecode.doc.costlymethod
     */
    MapLocation adjacentLocation(Direction dir);

    /**
     * Returns a list of all locations within the given radiusSquared of a location.
     * If radiusSquared is larger than the robot's vision radius, uses the robot's
     * vision radius instead.
     *
     * Checks that radiusSquared is non-negative.
     *
     * @param center the given location
     * @param radiusSquared return locations within this distance away from center
     * @return list of locations on the map and within radiusSquared of center
     * @throws GameActionException if the radius is negative (and not -1)
     *
     * @battlecode.doc.costlymethod
     */
    MapLocation[] getAllLocationsWithinRadiusSquared(MapLocation center, int radiusSquared) throws GameActionException;

    // ***********************************
    // ****** READINESS METHODS **********
    // ***********************************

    /**
     * Checks whether a robot is spawned.
     * 
     * @return whether or no a specific robot instance is spawned.
     * 
     * @battlecode.doc.costlymethod
     */
    boolean isSpawned();

    /**
     * Tests whether the robot can act.
     * 
     * @return true if the robot can act
     *
     * @battlecode.doc.costlymethod
     */
    boolean isActionReady();

    /**
     * Returns the number of action cooldown turns remaining before this unit can act again.
     * When this number is strictly less than {@link GameConstants#COOLDOWN_LIMIT}, isActionReady()
     * is true and the robot can act again. This number decreases by
     * {@link GameConstants#COOLDOWNS_PER_TURN} every turn.
     *
     * @return the number of action turns remaining before this unit can act again
     *
     * @battlecode.doc.costlymethod
     */
    int getActionCooldownTurns();

    /**
     * Tests whether the robot can move.
     * 
     * @return true if the robot can move
     *
     * @battlecode.doc.costlymethod
     */
    boolean isMovementReady();

    /**
     * Returns the number of movement cooldown turns remaining before this unit can move again.
     * When this number is strictly less than {@link GameConstants#COOLDOWN_LIMIT}, isMovementReady()
     * is true and the robot can move again. This number decreases by
     * {@link GameConstants#COOLDOWNS_PER_TURN} every turn.
     *
     * @return the number of cooldown turns remaining before this unit can move again
     *
     * @battlecode.doc.costlymethod
     */
    int getMovementCooldownTurns();

    // ***********************************
    // ****** MOVEMENT METHODS ***********
    // ***********************************

    /**
     * Checks whether this robot can move one step in the given direction.
     * Returns false if the robot is not in a mode that can move, if the target
     * location is not on the map, if the target location is occupied, if the target
     * location is impassible, or if there are cooldown turns remaining.
     *
     * @param dir the direction to move in
     * @return true if it is possible to call <code>move</code> without an exception
     *
     * @battlecode.doc.costlymethod
     */
    boolean canMove(Direction dir);

    /**
     * Moves one step in the given direction.
     *
     * @param dir the direction to move in
     * @throws GameActionException if the robot cannot move one step in this
     * direction, such as cooldown being too high, the target location being
     * off the map, or the target destination being occupied by another robot,
     * or the target destination being impassible.
     *
     * @battlecode.doc.costlymethod
     */
    void move(Direction dir) throws GameActionException;

    // ***********************************
    // *********** SPAWNING **************
    // ***********************************

    /**
     * Returns a MapLocation array of all locations with an ally spawn zone on them.
     * A robot must spawn inside one of these spawn zones.
     * 
     * @return a list of locations with an ally spawn zone
     */
    MapLocation[] getAllySpawnLocations();

    /**
     * Checks if the robot is allowed to spawn at the given location.
     * A robot can spawn only inside the spawn zones.
     * 
     * @param loc the location to spawn the robot
     * @return whether the robot can spawn at the location
     */
    boolean canSpawn(MapLocation loc);

    /**
     * Spawns the robot at the given location.
     * 
     * @param loc the location to spawn the robot
     * @throws GameActionException if the robot is not allowed to spawn at this location
     */
    void spawn(MapLocation loc) throws GameActionException;

    // ***********************************
    // *********** BUILDING **************
    // ***********************************

    /**
     * Checks if a robot can dig (create water) at the specified location.
     * 
     * @param loc the location to check
     * @return true if a robot can dig, false otherwise
     */
    boolean canDig(MapLocation loc);

    /**
     * Removes land and creates water in a location.
     * 
     * @param loc Location to dig
     * @throws GameActionException if loc is not diggable
     * 
     * @battlecode.doc.costlymethod
     */
    void dig(MapLocation loc) throws GameActionException;;

    /**
     * Checks if a location can be filled.
     * 
     * @param loc location to check if fillable
     * 
     * @return true if can fill in that location
     * 
     * @battlecode.doc.costlymethod
     */
    boolean canFill(MapLocation loc);

    /**
     * Fills a water location with land.
     * 
     * @param loc location to fill
     * @throws GameActionException if loc is not fillable
     * 
     * @battlecode.doc.costlymethod
     */
    void fill(MapLocation loc) throws GameActionException;;

    /**
     * Checks if a trap can be built at the given location.
     * 
     * @param building TrapType of trap to build at that location
     * @param loc location to aquaform
     * 
     * @return true if trap can be built at loc
     * 
     * @battlecode.doc.costlymethod
     */
    boolean canBuild(TrapType building, MapLocation loc);

    /**
     * Builds a trap at the given location.
     * 
     * @param building type of trap to build
     * @param loc location for trap type to build
     * @throws GameActionException if trap cannot be built at loc
     * 
     * @battlecode.doc.costlymethod
     */
    void build(TrapType building, MapLocation loc) throws GameActionException;;

    // ****************************
    // ***** ATTACK / HEAL ******** 
    // ****************************

    /**
     * Tests whether this robot can attack the given location. Robots can only attack
     * enemy robots, and attacks cannot miss.
     *
     * @param loc target location to attack 
     * @return whether it is possible to attack the given location
     *
     * @battlecode.doc.costlymethod
     */
    boolean canAttack(MapLocation loc);

    /** 
     * Attack a given location.
     *
     * @param loc the target location to attack
     * @throws GameActionException if conditions for attacking are not satisfied
     *
     * @battlecode.doc.costlymethod
     */
    void attack(MapLocation loc) throws GameActionException;

    /**
     * Tests whether this robot can heal a nearby friendly unit.
     * 
     * Checks that this robot can heal and whether the friendly unit is within range. Also checks that 
     * there are no cooldown turns remaining. 
     * 
     * @param loc location of friendly unit to be healed
     * @return whether it is possible for this robot to heal
     */
    boolean canHeal(MapLocation loc);

    /** 
     * Heal a nearby friendly unit.
     * 
     * @param loc the location of the friendly unit to be healed
     * @throws GameActionException if conditions for healing are not satisfied
     * 
     * @battlecode.doc.costlymethod
     */
    void heal(MapLocation loc) throws GameActionException;


    // ***************************
    // ******* FLAG METHODS ******
    // ***************************

    /**
     * Checks whether robot is currently holding a flag.
     * 
     * @return whether the robot is holding a flag
     * 
     * @battlecode.doc.costlymethod
     */
    boolean hasFlag();

    /**
     * Tests whether robot can pickup a flag at the current location.
     * 
     * Checks that the flag is within range and that the flag is a friendly flag
     * during setup phase or an enemy flag during attack phase. Also checks that
     * there are no cooldown turns remaining. 
     * 
     * @param loc the flag location
     * @return whether it is possible to pick up the flag
     * 
     * @battlecode.doc.costlymethod
     */
    boolean canPickupFlag(MapLocation loc);

    /**
     * Picks up flag at the specified location.
     * 
     * @param loc the flag location
     * @throws GameActionException if conditions for picking up flags are not satisfied
     * 
     * @battlecode.doc.costlymethod
     */
    void pickupFlag(MapLocation loc) throws GameActionException;

    /**
     * Tests whether the robot can drop a flag at the current location.
     * 
     * Checks that the flag is within range (at most sqrt(2) cells away from robot) and 
     * that the flag is a friendly flag during setup phase or an enemy flag during attack phase. 
     * Also checks that there are no cooldown turns remaining. 
     * 
     * @param loc target flag location
     * @return whether it is possible to pick up the flag
     * 
     * @battlecode.doc.costlymethod
     */
    boolean canDropFlag(MapLocation loc);
    
    /**
     * Places a flag at the current location on the map.
     *
     * @param loc location on the map 
     * @throws GameActionException if a flag cannot be dropped at this location
     * 
     * @battlecode.doc.costlymethod
     **/
    void dropFlag(MapLocation loc) throws GameActionException;


    // ***********************************
    // ****** COMMUNICATION METHODS ****** 
    // ***********************************

    /** 
     * Given an index, returns the value at that index in the team array.
     *
     * @param index the index in the team's shared array, 0-indexed
     * @return the value at that index in the team's shared array,
     * @throws GameActionException if the index is invalid
     *
     * @battlecode.doc.costlymethod
     */
    int readSharedArray(int index) throws GameActionException;

    /**
     * Checks if the given index and value are valid for writing to the shared array.
     * 
     * @param index the index in the team's shared array, 0-indexed
     * @param value the value to set that index to
     * @return whether the index and value are valid
     * 
     * @battlecode.doc.costlymethod 
     */
    boolean canWriteSharedArray(int index, int value);

    /** 
     * Sets the team's array value at a specified index. 
     * No change occurs if the index or value is invalid.
     *
     * @param index the index in the team's shared array, 0-indexed
     * @param value the value to set that index to
     * @throws GameActionException if the index is invalid or the value
     * is out of bounds.
     *
     * @battlecode.doc.costlymethod
     */
    void writeSharedArray(int index, int value) throws GameActionException;

    // ***********************************
    // ****** OTHER ACTION METHODS *******
    // ***********************************

    /**
     * Tests whether you can buy an upgrade.
     * 
     * You can buy the upgrade if you have enough points and 
     * haven't bought the upgrade before. 
     * 
     * @param ug the global upgrade
     * @return whether it is valid for you to buy the upgrade
     * 
     * @battlecode.doc.costlymethod
     **/
    boolean canBuyGlobal(GlobalUpgrade ug);

    /**
     * Purchases the global upgrade and applies the effect to the game.
     * 
     * @param ug the global upgrade 
     * @throws GameActionException if the robot is not able to buy the upgrade
     * 
     * @battlecode.doc.costlymethod
     **/
    void buyGlobal(GlobalUpgrade ug) throws GameActionException;
    
    /**
     * Causes your team to lose the game. It's like typing "gg."
     *
     * @battlecode.doc.costlymethod
     */
    void resign();

    // ***********************************
    // ******** DEBUG METHODS ************
    // ***********************************

    /**
     * Sets the indicator string for this robot for debugging purposes. Only the first
     * {@link GameConstants#INDICATOR_STRING_MAX_LENGTH} characters are used.
     *
     * @param string the indicator string this round
     *
     * @battlecode.doc.costlymethod
     */
    void setIndicatorString(String string);

    /**
     * Draw a dot on the game map for debugging purposes.
     *
     * @param loc the location to draw the dot
     * @param red the red component of the dot's color
     * @param green the green component of the dot's color
     * @param blue the blue component of the dot's color
     *
     * @battlecode.doc.costlymethod
     */
    void setIndicatorDot(MapLocation loc, int red, int green, int blue);

    /**
     * Draw a line on the game map for debugging purposes.
     *
     * @param startLoc the location to draw the line from
     * @param endLoc the location to draw the line to
     * @param red the red component of the line's color
     * @param green the green component of the line's color
     * @param blue the blue component of the line's color
     *
     * @battlecode.doc.costlymethod
     */
    void setIndicatorLine(MapLocation startLoc, MapLocation endLoc, int red, int green, int blue);
}
