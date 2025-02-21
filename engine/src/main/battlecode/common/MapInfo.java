package battlecode.common;

public class MapInfo {

    private MapLocation loc;

    private boolean isPassable;

    private boolean isWall;

    // 1 = Team A, 2 = Team B, 0 = not a spawn zone
    private int spawnZone;

    private boolean isWater;

    private int crumbsAmount;

    private TrapType trapType;

    public MapInfo(MapLocation loc, boolean isPassable, boolean isWall, int spawnZone, boolean isWater, int crumbsAmount, TrapType trapType){
        this.loc = loc;
        this.isPassable = isPassable;
        this.isWall = isWall;
        this.spawnZone = spawnZone;
        this.isWater = isWater;
        this.crumbsAmount = crumbsAmount;
        this.trapType = trapType;
    }

    /**
     * Returns if this square is passable.
     * 
     * @return whether this square is passable
     * 
     * @battlecode.doc.costlymethod
     */
    public boolean isPassable() {
        return isPassable;
    }

    /**
     * Returns if this square is a wall.
     * 
     * @return whether this square is a wall
     * 
     * @battlecode.doc.costlymethod
     */
    public boolean isWall() {
        return isWall;
    }

    /**
     * Returns if this square is a spawn zone.
     * 
     * @return whether this square is a spawn zone
     * 
     * @battlecode.doc.costlymethod
     */
    public boolean isSpawnZone() {
        return spawnZone > 0;
    }

    /**
     * Returns 1 if this square is a Team A spawn zone,
     * 2 if this square is a Team B spawn zone, and
     * 0 if this square is not a spawn zone.
     * 
     * @return 1 or 2 if the square is a Team A or B spawn zone, respectively; 0 otherwise
     */
    public int getSpawnZoneTeam() {
        return spawnZone;
    }

    /**
     * Returns if this square has water in it.
     * 
     * @return whether this square has water
     * 
     * @battlecode.doc.costlymethod
     */
    public boolean isWater() {
        return isWater;
    }

    /**
     * Returns the amount of crumbs on this square.
     * If there are no crumbs on the square, returns 0.
     * 
     * @return the amount of crumbs on the square
     * 
     * @battlecode.doc.costlymethod
     */
    public int getCrumbs() {
        return crumbsAmount;
    }

    /**
     * Returns the trap type of a friendly trap. TrapType.NONE if there
     * is no trap or there is an enemy trap.
     * @return The trap type
     */
    public TrapType getTrapType() {
        return trapType;
    }

    /**
     * Returns the location of this square
     * 
     * @return the location of this square
     * 
     * @battlecode.doc.costlymethod
     */
    public MapLocation getMapLocation() {
        return loc;
    }

    public String toString(){
        return "Location{" +
                "loc=" + loc +
                (isWall ? ", wall" : "") +
                (isWater ? ", water" : "") +
                (spawnZone == 1 ? ", team A spawn zone" : "") +
                (spawnZone == 2 ? ", team B spawn zone" : "") +
                (crumbsAmount == 0 ? "" : ", crumbs=" + crumbsAmount) +
                (trapType == null ? "" : ", trap=" + trapType) +
                '}';
    }

}