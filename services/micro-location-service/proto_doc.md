# Protocol Documentation
<a name="top"/>

## Table of Contents
* [locations.proto](#locations.proto)
 * [Detail](#locations.Detail)
 * [Details](#locations.Details)
 * [Empty](#locations.Empty)
 * [Id](#locations.Id)
 * [Location](#locations.Location)
 * [Locations](#locations.Locations)
 * [Overview](#locations.Overview)
 * [Overviews](#locations.Overviews)
 * [micro](#locations.micro)
* [Scalar Value Types](#scalar-value-types)

<a name="locations.proto"/>
<p align="right"><a href="#top">Top</a></p>

## locations.proto



<a name="locations.Detail"/>
### Detail


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  |
| name | [string](#string) | optional |  |
| count | [int32](#int32) | optional |  | |


<a name="locations.Details"/>
### Details


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Detail](#locations.Detail) | repeated |  | |


<a name="locations.Empty"/>
### Empty


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |


<a name="locations.Id"/>
### Id


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  | |


<a name="locations.Location"/>
### Location


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  |
| name | [string](#string) | optional |  |
| time_zone | [string](#string) | optional |  |
| created_at | [string](#string) | optional |  |
| updated_at | [string](#string) | optional |  |
| auditor_id | [string](#string) | optional |  |
| auditor_name | [string](#string) | optional |  | |


<a name="locations.Locations"/>
### Locations


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Location](#locations.Location) | repeated |  | |


<a name="locations.Overview"/>
### Overview


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  |
| title | [string](#string) | optional |  |
| count | [int32](#int32) | optional |  | |


<a name="locations.Overviews"/>
### Overviews


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Overview](#locations.Overview) | repeated |  | |




<a name="locations.micro"/>
### micro


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| List | [Empty](#locations.Empty) | [Locations](#locations.Locations) |  |
| Get | [Id](#locations.Id) | [Location](#locations.Location) |  |
| Create | [Location](#locations.Location) | [Empty](#locations.Empty) |  |
| Update | [Location](#locations.Location) | [Location](#locations.Location) |  |
| Delete | [Id](#locations.Id) | [Empty](#locations.Empty) |  |
| GetAllLocationsDetails | [Empty](#locations.Empty) | [Overviews](#locations.Overviews) |  |
| GetLocationDetails | [Id](#locations.Id) | [Details](#locations.Details) |  | |



<a name="scalar-value-types"/>
## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double"/> double |  | double | double | float |
| <a name="float"/> float |  | float | float | float |
| <a name="int32"/> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64"/> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32"/> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64"/> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32"/> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64"/> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32"/> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64"/> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32"/> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64"/> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool"/> bool |  | bool | boolean | boolean |
| <a name="string"/> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes"/> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |
