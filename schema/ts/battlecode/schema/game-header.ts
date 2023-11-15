// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { BuildActionMetadata } from '../../battlecode/schema/build-action-metadata';
import { Constants } from '../../battlecode/schema/constants';
import { GlobalUpgradeMetadata } from '../../battlecode/schema/global-upgrade-metadata';
import { SpecializationMetadata } from '../../battlecode/schema/specialization-metadata';
import { TeamData } from '../../battlecode/schema/team-data';


/**
 * The first event sent in the game. Contains all metadata about the game.
 */
export class GameHeader {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):GameHeader {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsGameHeader(bb:flatbuffers.ByteBuffer, obj?:GameHeader):GameHeader {
  return (obj || new GameHeader()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsGameHeader(bb:flatbuffers.ByteBuffer, obj?:GameHeader):GameHeader {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new GameHeader()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

specVersion():string|null
specVersion(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
specVersion(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

teams(index: number, obj?:TeamData):TeamData|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new TeamData()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

teamsLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

specializationMetadata(index: number, obj?:SpecializationMetadata):SpecializationMetadata|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new SpecializationMetadata()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

specializationMetadataLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

buildActionMetadata(index: number, obj?:BuildActionMetadata):BuildActionMetadata|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new BuildActionMetadata()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

buildActionMetadataLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

globalUpgradeMetadata(index: number, obj?:GlobalUpgradeMetadata):GlobalUpgradeMetadata|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? (obj || new GlobalUpgradeMetadata()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

globalUpgradeMetadataLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

constants(obj?:Constants):Constants|null {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? (obj || new Constants()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startGameHeader(builder:flatbuffers.Builder) {
  builder.startObject(6);
}

static addSpecVersion(builder:flatbuffers.Builder, specVersionOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, specVersionOffset, 0);
}

static addTeams(builder:flatbuffers.Builder, teamsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, teamsOffset, 0);
}

static createTeamsVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startTeamsVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addSpecializationMetadata(builder:flatbuffers.Builder, specializationMetadataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, specializationMetadataOffset, 0);
}

static createSpecializationMetadataVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startSpecializationMetadataVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addBuildActionMetadata(builder:flatbuffers.Builder, buildActionMetadataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, buildActionMetadataOffset, 0);
}

static createBuildActionMetadataVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startBuildActionMetadataVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addGlobalUpgradeMetadata(builder:flatbuffers.Builder, globalUpgradeMetadataOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, globalUpgradeMetadataOffset, 0);
}

static createGlobalUpgradeMetadataVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startGlobalUpgradeMetadataVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addConstants(builder:flatbuffers.Builder, constantsOffset:flatbuffers.Offset) {
  builder.addFieldOffset(5, constantsOffset, 0);
}

static endGameHeader(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}
