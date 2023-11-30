import { Buffer } from "buffer";
import * as Layout from "./layout";

/**
 * @internal
 */


/**
 * Populate a buffer of instruction data using an InstructionType
 * @internal
 */
export function encodeData(type: any, fields?: any): Buffer {
  const allocLength =
    type.layout.span >= 0 ? type.layout.span : Layout.getAlloc(type, fields);
  const data = Buffer.alloc(allocLength);
  const layoutFields = Object.assign({ instruction: type.index }, fields);
  type.layout.encode(layoutFields, data);
  return data;
}
