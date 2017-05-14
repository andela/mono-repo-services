# Protocol Documentation
<a name="top"/>

## Table of Contents
* [location-svc.proto](#location-svc.proto)
 * [Detail](#location.Detail)
 * [Details](#location.Details)
 * [Empty](#location.Empty)
 * [Id](#location.Id)
 * [Location](#location.Location)
 * [Locations](#location.Locations)
 * [Overview](#location.Overview)
 * [Overviews](#location.Overviews)
 * [micro](#location.LocationService)
* [Scalar Value Types](#scalar-value-types)

<a name="location-svc.proto"/>
<p align="right"><a href="#top">Top</a></p>

## location-svc.proto



<a name="location.Detail"/>
### Detail


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  |
| name | [string](#string) | optional |  |
| count | [int32](#int32) | optional |  | |


<a name="location.Details"/>
### Details


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Detail](#location.Detail) | repeated |  | |


<a name="location.Empty"/>
### Empty


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |


<a name="location.Id"/>
### Id


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  | |


<a name="location.Location"/>
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


<a name="location.Locations"/>
### Locations


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Location](#location.Location) | repeated |  | |


<a name="location.Overview"/>
### Overview


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) | optional |  |
| title | [string](#string) | optional |  |
| count | [int32](#int32) | optional |  | |


<a name="location.Overviews"/>
### Overviews


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| values | [Overview](#location.Overview) | repeated |  | |




<a name="location.LocationService"/>
### micro


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| List | [Empty](#location.Empty) | [Locations](#location.Locations) |  |
| Get | [Id](#location.Id) | [Location](#location.Location) |  |
| Create | [Location](#location.Location) | [Empty](#location.Empty) |  |
| Update | [Location](#location.Location) | [Location](#location.Location) |  |
| Delete | [Id](#location.Id) | [Empty](#location.Empty) |  |
| GetAllLocationsDetails | [Empty](#location.Empty) | [Overviews](#location.Overviews) |  |
| GetLocationDetails | [Id](#location.Id) | [Details](#location.Details) |  | |



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
