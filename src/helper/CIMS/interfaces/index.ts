import Stream from "stream";

export interface IGUID {
  GUID: string;
}
export interface IContactIDPick {
  ContactIDPick: string;
}
export interface IFacilityIDPick {
  FacilityIDPick: string;
}
export interface IFloorIDPick {
  FloorIDPick: string;
}
export interface ISpaceIDPick {
  SpaceIDPick: string;
}
export interface IRegisterIDPick {
  RegisterIDPick: string;
}
export interface IContactCIMSFlds extends IGUID, IContactIDPick {}

export interface IFacilityCIMSFlds extends IGUID, IFacilityIDPick {}

export interface IFloorCIMSFlds extends IGUID, IFacilityIDPick, IFloorIDPick {}

export interface ISystemCIMSFlds
  extends IGUID,
    IFacilityIDPick,
    IFloorIDPick,
    ISpaceIDPick {}

export interface ISpaceCIMSFlds extends IGUID, IFloorIDPick, ISpaceIDPick {}

export interface IRegisterCIMSFlds
  extends IGUID,
    IFacilityIDPick,
    IRegisterIDPick {}

export interface IComponentCIMSFlds
  extends IGUID,
    IFacilityIDPick,
    IFloorIDPick,
    ISpaceIDPick,
    IRegisterIDPick {}

export interface ICIMSDumpRequest {
  cimsFile: Stream.Readable & { hapi: { filename: string } };
  ProjectGUID: string;
}
