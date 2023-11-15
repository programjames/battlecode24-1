// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { SpawnedBodyTable } from '../../battlecode/schema/spawned-body-table';
import { Vec } from '../../battlecode/schema/vec';
import { VecTable } from '../../battlecode/schema/vec-table';


export class GameMap {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):GameMap {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGameMap(bb:flatbuffers.ByteBuffer, obj?:GameMap):GameMap {
  return (obj || new GameMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGameMap(bb:flatbuffers.ByteBuffer, obj?:GameMap):GameMap {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GameMap()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

size(obj?:Vec):Vec|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new Vec()).__init(this.bb_pos + offset, this.bb!) : null;
}

symmetry():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

bodies(obj?:SpawnedBodyTable):SpawnedBodyTable|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new SpawnedBodyTable()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

randomSeed():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.readInt32(this.bb_pos + offset) : 0;
}

walls(index: number):boolean|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? !!this.bb!.readInt8(this.bb!.__vector(this.bb_pos + offset) + index) : false;
}

wallsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

wallsArray():Int8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? new Int8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

water(index: number):boolean|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? !!this.bb!.readInt8(this.bb!.__vector(this.bb_pos + offset) + index) : false;
}

waterLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

waterArray():Int8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? new Int8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

divider(index: number):boolean|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? !!this.bb!.readInt8(this.bb!.__vector(this.bb_pos + offset) + index) : false;
}

dividerLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

dividerArray():Int8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? new Int8Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

spawnLocations(obj?:VecTable):VecTable|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? (obj || new VecTable()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

resourcePiles(obj?:VecTable):VecTable|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? (obj || new VecTable()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

resourcePileAmounts(index: number):number|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.readInt32(this.bb!.__vector(this.bb_pos + offset) + index * 4) : 0;
}

resourcePileAmountsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

resourcePileAmountsArray():Int32Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 24);
  return offset ? new Int32Array(this.bb!.bytes().buffer, this.bb!.bytes().byteOffset + this.bb!.__vector(this.bb_pos + offset), this.bb!.__vector_len(this.bb_pos + offset)) : null;
}

static startGameMap(builder:flatbuffers.Builder) {
  builder.startObject(11);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, nameOffset, 0);
}

static addSize(builder:flatbuffers.Builder, sizeOffset:flatbuffers.Offset) {
  builder.addFieldStruct(1, sizeOffset, 0);
}

static addSymmetry(builder:flatbuffers.Builder, symmetry:number) {
  builder.addFieldInt32(2, symmetry, 0);
}

static addBodies(builder:flatbuffers.Builder, bodiesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, bodiesOffset, 0);
}

static addRandomSeed(builder:flatbuffers.Builder, randomSeed:number) {
  builder.addFieldInt32(4, randomSeed, 0);
}

static addWalls(builder:flatbuffers.Builder, wallsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, wallsOffset, 0);
}

static createWallsVector(builder:flatbuffers.Builder, data:boolean[]):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(+data[i]!);
  }
  return builder.endVector();
}

static startWallsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addWater(builder:flatbuffers.Builder, waterOffset:flatbuffers.Offset) {
  builder.addFieldOffset(6, waterOffset, 0);
}

static createWaterVector(builder:flatbuffers.Builder, data:boolean[]):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(+data[i]!);
  }
  return builder.endVector();
}

static startWaterVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addDivider(builder:flatbuffers.Builder, dividerOffset:flatbuffers.Offset) {
  builder.addFieldOffset(7, dividerOffset, 0);
}

static createDividerVector(builder:flatbuffers.Builder, data:boolean[]):flatbuffers.Offset {
  builder.startVector(1, data.length, 1);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt8(+data[i]!);
  }
  return builder.endVector();
}

static startDividerVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(1, numElems, 1);
}

static addSpawnLocations(builder:flatbuffers.Builder, spawnLocationsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, spawnLocationsOffset, 0);
}

static addResourcePiles(builder:flatbuffers.Builder, resourcePilesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, resourcePilesOffset, 0);
}

static addResourcePileAmounts(builder:flatbuffers.Builder, resourcePileAmountsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(10, resourcePileAmountsOffset, 0);
}

static createResourcePileAmountsVector(builder:flatbuffers.Builder, data:number[]|Int32Array):flatbuffers.Offset;
/**
 * @deprecated This Uint8Array overload will be removed in the future.
 */
static createResourcePileAmountsVector(builder:flatbuffers.Builder, data:number[]|Uint8Array):flatbuffers.Offset;
static createResourcePileAmountsVector(builder:flatbuffers.Builder, data:number[]|Int32Array|Uint8Array):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addInt32(data[i]!);
  }
  return builder.endVector();
}

static startResourcePileAmountsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endGameMap(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}
