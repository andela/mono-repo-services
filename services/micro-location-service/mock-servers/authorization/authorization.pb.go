// Code generated by protoc-gen-go.
// source: authorization/authorization.proto
// DO NOT EDIT!

/*
Package authorization is a generated protocol buffer package.

It is generated from these files:
	authorization/authorization.proto

It has these top-level messages:
	Empty
	AuthorizeRequest
	Permission
	PermissionID
	PermissionList
	PermissionIdList
	Activity
	ActivityID
	RolesID
	AssignRequest
	ActivityList
	Response
*/
package authorization

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

import (
	context "golang.org/x/net/context"
	grpc "google.golang.org/grpc"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type Method int32

const (
	Method_POST   Method = 0
	Method_GET    Method = 1
	Method_PATCH  Method = 2
	Method_PUT    Method = 3
	Method_DELETE Method = 4
)

var Method_name = map[int32]string{
	0: "POST",
	1: "GET",
	2: "PATCH",
	3: "PUT",
	4: "DELETE",
}
var Method_value = map[string]int32{
	"POST":   0,
	"GET":    1,
	"PATCH":  2,
	"PUT":    3,
	"DELETE": 4,
}

func (x Method) String() string {
	return proto.EnumName(Method_name, int32(x))
}
func (Method) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type Empty struct {
}

func (m *Empty) Reset()                    { *m = Empty{} }
func (m *Empty) String() string            { return proto.CompactTextString(m) }
func (*Empty) ProtoMessage()               {}
func (*Empty) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type AuthorizeRequest struct {
	Url           string  `protobuf:"bytes,1,opt,name=url" json:"url,omitempty"`
	Method        Method  `protobuf:"varint,2,opt,name=method,enum=authorization.Method" json:"method,omitempty"`
	PermissionIds []int32 `protobuf:"varint,3,rep,name=permission_ids,json=permissionIds" json:"permission_ids,omitempty"`
}

func (m *AuthorizeRequest) Reset()                    { *m = AuthorizeRequest{} }
func (m *AuthorizeRequest) String() string            { return proto.CompactTextString(m) }
func (*AuthorizeRequest) ProtoMessage()               {}
func (*AuthorizeRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

type Permission struct {
	Id         int32       `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	Name       string      `protobuf:"bytes,2,opt,name=name" json:"name,omitempty"`
	Activities []*Activity `protobuf:"bytes,3,rep,name=activities" json:"activities,omitempty"`
	CreatedAt  string      `protobuf:"bytes,4,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
	UpdatedAt  string      `protobuf:"bytes,5,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
}

func (m *Permission) Reset()                    { *m = Permission{} }
func (m *Permission) String() string            { return proto.CompactTextString(m) }
func (*Permission) ProtoMessage()               {}
func (*Permission) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{2} }

func (m *Permission) GetActivities() []*Activity {
	if m != nil {
		return m.Activities
	}
	return nil
}

type PermissionID struct {
	Id int32 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
}

func (m *PermissionID) Reset()                    { *m = PermissionID{} }
func (m *PermissionID) String() string            { return proto.CompactTextString(m) }
func (*PermissionID) ProtoMessage()               {}
func (*PermissionID) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{3} }

type PermissionList struct {
	Permissions []*Permission `protobuf:"bytes,1,rep,name=permissions" json:"permissions,omitempty"`
}

func (m *PermissionList) Reset()                    { *m = PermissionList{} }
func (m *PermissionList) String() string            { return proto.CompactTextString(m) }
func (*PermissionList) ProtoMessage()               {}
func (*PermissionList) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{4} }

func (m *PermissionList) GetPermissions() []*Permission {
	if m != nil {
		return m.Permissions
	}
	return nil
}

type PermissionIdList struct {
	PermissionIds []int32 `protobuf:"varint,1,rep,name=permission_ids,json=permissionIds" json:"permission_ids,omitempty"`
}

func (m *PermissionIdList) Reset()                    { *m = PermissionIdList{} }
func (m *PermissionIdList) String() string            { return proto.CompactTextString(m) }
func (*PermissionIdList) ProtoMessage()               {}
func (*PermissionIdList) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{5} }

type Activity struct {
	Id           int32  `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	Url          string `protobuf:"bytes,2,opt,name=url" json:"url,omitempty"`
	Method       Method `protobuf:"varint,3,opt,name=method,enum=authorization.Method" json:"method,omitempty"`
	PermissionId int32  `protobuf:"varint,4,opt,name=permission_id,json=permissionId" json:"permission_id,omitempty"`
	CreatedAt    string `protobuf:"bytes,5,opt,name=created_at,json=createdAt" json:"created_at,omitempty"`
	UpdatedAt    string `protobuf:"bytes,6,opt,name=updated_at,json=updatedAt" json:"updated_at,omitempty"`
}

func (m *Activity) Reset()                    { *m = Activity{} }
func (m *Activity) String() string            { return proto.CompactTextString(m) }
func (*Activity) ProtoMessage()               {}
func (*Activity) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{6} }

type ActivityID struct {
	Id int32 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
}

func (m *ActivityID) Reset()                    { *m = ActivityID{} }
func (m *ActivityID) String() string            { return proto.CompactTextString(m) }
func (*ActivityID) ProtoMessage()               {}
func (*ActivityID) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{7} }

type RolesID struct {
	Ids []int32 `protobuf:"varint,1,rep,name=ids" json:"ids,omitempty"`
}

func (m *RolesID) Reset()                    { *m = RolesID{} }
func (m *RolesID) String() string            { return proto.CompactTextString(m) }
func (*RolesID) ProtoMessage()               {}
func (*RolesID) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{8} }

type AssignRequest struct {
	Id           int32 `protobuf:"varint,1,opt,name=id" json:"id,omitempty"`
	RoleId       int32 `protobuf:"varint,2,opt,name=role_id,json=roleId" json:"role_id,omitempty"`
	PermissionId int32 `protobuf:"varint,3,opt,name=permission_id,json=permissionId" json:"permission_id,omitempty"`
}

func (m *AssignRequest) Reset()                    { *m = AssignRequest{} }
func (m *AssignRequest) String() string            { return proto.CompactTextString(m) }
func (*AssignRequest) ProtoMessage()               {}
func (*AssignRequest) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{9} }

type ActivityList struct {
	Activities []*Activity `protobuf:"bytes,1,rep,name=activities" json:"activities,omitempty"`
}

func (m *ActivityList) Reset()                    { *m = ActivityList{} }
func (m *ActivityList) String() string            { return proto.CompactTextString(m) }
func (*ActivityList) ProtoMessage()               {}
func (*ActivityList) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{10} }

func (m *ActivityList) GetActivities() []*Activity {
	if m != nil {
		return m.Activities
	}
	return nil
}

type Response struct {
	Response bool `protobuf:"varint,1,opt,name=response" json:"response,omitempty"`
}

func (m *Response) Reset()                    { *m = Response{} }
func (m *Response) String() string            { return proto.CompactTextString(m) }
func (*Response) ProtoMessage()               {}
func (*Response) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{11} }

func init() {
	proto.RegisterType((*Empty)(nil), "authorization.Empty")
	proto.RegisterType((*AuthorizeRequest)(nil), "authorization.AuthorizeRequest")
	proto.RegisterType((*Permission)(nil), "authorization.Permission")
	proto.RegisterType((*PermissionID)(nil), "authorization.PermissionID")
	proto.RegisterType((*PermissionList)(nil), "authorization.PermissionList")
	proto.RegisterType((*PermissionIdList)(nil), "authorization.PermissionIdList")
	proto.RegisterType((*Activity)(nil), "authorization.Activity")
	proto.RegisterType((*ActivityID)(nil), "authorization.ActivityID")
	proto.RegisterType((*RolesID)(nil), "authorization.RolesID")
	proto.RegisterType((*AssignRequest)(nil), "authorization.AssignRequest")
	proto.RegisterType((*ActivityList)(nil), "authorization.ActivityList")
	proto.RegisterType((*Response)(nil), "authorization.Response")
	proto.RegisterEnum("authorization.Method", Method_name, Method_value)
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion3

// Client API for Micro service

type MicroClient interface {
	CreatePermission(ctx context.Context, in *Permission, opts ...grpc.CallOption) (*Empty, error)
	UpdatePermission(ctx context.Context, in *Permission, opts ...grpc.CallOption) (*Empty, error)
	DeletePermission(ctx context.Context, in *PermissionID, opts ...grpc.CallOption) (*Empty, error)
	FindPermission(ctx context.Context, in *PermissionID, opts ...grpc.CallOption) (*Permission, error)
	ListPermission(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*PermissionList, error)
	CreateActivity(ctx context.Context, in *Activity, opts ...grpc.CallOption) (*Empty, error)
	UpdateActivity(ctx context.Context, in *Activity, opts ...grpc.CallOption) (*Empty, error)
	DeleteActivity(ctx context.Context, in *ActivityID, opts ...grpc.CallOption) (*Empty, error)
	FindActivity(ctx context.Context, in *ActivityID, opts ...grpc.CallOption) (*Activity, error)
	ListActivity(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*ActivityList, error)
	AssignPermission(ctx context.Context, in *AssignRequest, opts ...grpc.CallOption) (*Empty, error)
	FetchPermissions(ctx context.Context, in *RolesID, opts ...grpc.CallOption) (*PermissionList, error)
	Authorize(ctx context.Context, in *AuthorizeRequest, opts ...grpc.CallOption) (*Response, error)
}

type microClient struct {
	cc *grpc.ClientConn
}

func NewMicroClient(cc *grpc.ClientConn) MicroClient {
	return &microClient{cc}
}

func (c *microClient) CreatePermission(ctx context.Context, in *Permission, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/CreatePermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) UpdatePermission(ctx context.Context, in *Permission, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/UpdatePermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) DeletePermission(ctx context.Context, in *PermissionID, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/DeletePermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) FindPermission(ctx context.Context, in *PermissionID, opts ...grpc.CallOption) (*Permission, error) {
	out := new(Permission)
	err := grpc.Invoke(ctx, "/authorization.micro/FindPermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) ListPermission(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*PermissionList, error) {
	out := new(PermissionList)
	err := grpc.Invoke(ctx, "/authorization.micro/ListPermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) CreateActivity(ctx context.Context, in *Activity, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/CreateActivity", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) UpdateActivity(ctx context.Context, in *Activity, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/UpdateActivity", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) DeleteActivity(ctx context.Context, in *ActivityID, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/DeleteActivity", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) FindActivity(ctx context.Context, in *ActivityID, opts ...grpc.CallOption) (*Activity, error) {
	out := new(Activity)
	err := grpc.Invoke(ctx, "/authorization.micro/FindActivity", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) ListActivity(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*ActivityList, error) {
	out := new(ActivityList)
	err := grpc.Invoke(ctx, "/authorization.micro/ListActivity", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) AssignPermission(ctx context.Context, in *AssignRequest, opts ...grpc.CallOption) (*Empty, error) {
	out := new(Empty)
	err := grpc.Invoke(ctx, "/authorization.micro/AssignPermission", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) FetchPermissions(ctx context.Context, in *RolesID, opts ...grpc.CallOption) (*PermissionList, error) {
	out := new(PermissionList)
	err := grpc.Invoke(ctx, "/authorization.micro/FetchPermissions", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *microClient) Authorize(ctx context.Context, in *AuthorizeRequest, opts ...grpc.CallOption) (*Response, error) {
	out := new(Response)
	err := grpc.Invoke(ctx, "/authorization.micro/Authorize", in, out, c.cc, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API for Micro service

type MicroServer interface {
	CreatePermission(context.Context, *Permission) (*Empty, error)
	UpdatePermission(context.Context, *Permission) (*Empty, error)
	DeletePermission(context.Context, *PermissionID) (*Empty, error)
	FindPermission(context.Context, *PermissionID) (*Permission, error)
	ListPermission(context.Context, *Empty) (*PermissionList, error)
	CreateActivity(context.Context, *Activity) (*Empty, error)
	UpdateActivity(context.Context, *Activity) (*Empty, error)
	DeleteActivity(context.Context, *ActivityID) (*Empty, error)
	FindActivity(context.Context, *ActivityID) (*Activity, error)
	ListActivity(context.Context, *Empty) (*ActivityList, error)
	AssignPermission(context.Context, *AssignRequest) (*Empty, error)
	FetchPermissions(context.Context, *RolesID) (*PermissionList, error)
	Authorize(context.Context, *AuthorizeRequest) (*Response, error)
}

func RegisterMicroServer(s *grpc.Server, srv MicroServer) {
	s.RegisterService(&_Micro_serviceDesc, srv)
}

func _Micro_CreatePermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Permission)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).CreatePermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/CreatePermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).CreatePermission(ctx, req.(*Permission))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_UpdatePermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Permission)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).UpdatePermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/UpdatePermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).UpdatePermission(ctx, req.(*Permission))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_DeletePermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PermissionID)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).DeletePermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/DeletePermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).DeletePermission(ctx, req.(*PermissionID))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_FindPermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PermissionID)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).FindPermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/FindPermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).FindPermission(ctx, req.(*PermissionID))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_ListPermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).ListPermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/ListPermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).ListPermission(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_CreateActivity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Activity)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).CreateActivity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/CreateActivity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).CreateActivity(ctx, req.(*Activity))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_UpdateActivity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Activity)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).UpdateActivity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/UpdateActivity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).UpdateActivity(ctx, req.(*Activity))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_DeleteActivity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ActivityID)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).DeleteActivity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/DeleteActivity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).DeleteActivity(ctx, req.(*ActivityID))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_FindActivity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ActivityID)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).FindActivity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/FindActivity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).FindActivity(ctx, req.(*ActivityID))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_ListActivity_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).ListActivity(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/ListActivity",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).ListActivity(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_AssignPermission_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AssignRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).AssignPermission(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/AssignPermission",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).AssignPermission(ctx, req.(*AssignRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_FetchPermissions_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RolesID)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).FetchPermissions(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/FetchPermissions",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).FetchPermissions(ctx, req.(*RolesID))
	}
	return interceptor(ctx, in, info, handler)
}

func _Micro_Authorize_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AuthorizeRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(MicroServer).Authorize(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/authorization.micro/Authorize",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(MicroServer).Authorize(ctx, req.(*AuthorizeRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var _Micro_serviceDesc = grpc.ServiceDesc{
	ServiceName: "authorization.micro",
	HandlerType: (*MicroServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreatePermission",
			Handler:    _Micro_CreatePermission_Handler,
		},
		{
			MethodName: "UpdatePermission",
			Handler:    _Micro_UpdatePermission_Handler,
		},
		{
			MethodName: "DeletePermission",
			Handler:    _Micro_DeletePermission_Handler,
		},
		{
			MethodName: "FindPermission",
			Handler:    _Micro_FindPermission_Handler,
		},
		{
			MethodName: "ListPermission",
			Handler:    _Micro_ListPermission_Handler,
		},
		{
			MethodName: "CreateActivity",
			Handler:    _Micro_CreateActivity_Handler,
		},
		{
			MethodName: "UpdateActivity",
			Handler:    _Micro_UpdateActivity_Handler,
		},
		{
			MethodName: "DeleteActivity",
			Handler:    _Micro_DeleteActivity_Handler,
		},
		{
			MethodName: "FindActivity",
			Handler:    _Micro_FindActivity_Handler,
		},
		{
			MethodName: "ListActivity",
			Handler:    _Micro_ListActivity_Handler,
		},
		{
			MethodName: "AssignPermission",
			Handler:    _Micro_AssignPermission_Handler,
		},
		{
			MethodName: "FetchPermissions",
			Handler:    _Micro_FetchPermissions_Handler,
		},
		{
			MethodName: "Authorize",
			Handler:    _Micro_Authorize_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: fileDescriptor0,
}

func init() { proto.RegisterFile("authorization/authorization.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 654 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x09, 0x6e, 0x88, 0x02, 0xff, 0xa4, 0x55, 0x6f, 0x6f, 0xd3, 0x3e,
	0x10, 0x5e, 0x9a, 0x26, 0x6d, 0x6f, 0x6d, 0x14, 0x59, 0xbf, 0x1f, 0xeb, 0xd6, 0x0d, 0x46, 0x10,
	0x68, 0x42, 0x62, 0x48, 0xe5, 0x05, 0x42, 0x7b, 0x15, 0xb5, 0x59, 0x57, 0xd8, 0x44, 0x65, 0xba,
	0x97, 0x68, 0x0a, 0x8d, 0xc5, 0x22, 0xb5, 0x4d, 0x49, 0x5c, 0xa4, 0xed, 0x0b, 0x21, 0xbe, 0x04,
	0x9f, 0x0d, 0xdb, 0xf9, 0x9f, 0x26, 0xa3, 0x82, 0x77, 0xf6, 0xdd, 0xf9, 0xf1, 0x73, 0xcf, 0xdd,
	0xd9, 0xf0, 0xd4, 0x5e, 0xd3, 0x5b, 0xcf, 0x77, 0xef, 0x6d, 0xea, 0x7a, 0xcb, 0xd7, 0xb9, 0xdd,
	0xe9, 0xca, 0xf7, 0xa8, 0x87, 0x3a, 0x39, 0xa3, 0xd1, 0x00, 0xc5, 0x5a, 0xac, 0xe8, 0x9d, 0x71,
	0x0f, 0xba, 0x19, 0x79, 0x08, 0x26, 0xdf, 0xd6, 0x24, 0xa0, 0x48, 0x07, 0x79, 0xed, 0xcf, 0xbb,
	0xd2, 0xb1, 0x74, 0xd2, 0xc2, 0x7c, 0x89, 0x5e, 0x81, 0xba, 0x20, 0x2c, 0xca, 0xe9, 0xd6, 0x98,
	0x51, 0xeb, 0xff, 0x7f, 0x9a, 0xbf, 0xe3, 0x4a, 0x38, 0x71, 0x14, 0x84, 0x9e, 0x83, 0xb6, 0x22,
	0xfe, 0xc2, 0x0d, 0x02, 0xe6, 0xbc, 0x71, 0x9d, 0xa0, 0x2b, 0x1f, 0xcb, 0x27, 0x0a, 0xee, 0xa4,
	0xd6, 0xb1, 0x13, 0x18, 0x3f, 0x24, 0x80, 0x49, 0x62, 0x41, 0x1a, 0xd4, 0x5c, 0x47, 0xdc, 0xaa,
	0x60, 0xb6, 0x42, 0x08, 0xea, 0x4b, 0x7b, 0x41, 0xc4, 0x95, 0x2d, 0x2c, 0xd6, 0xe8, 0x2d, 0x80,
	0x3d, 0xa3, 0xee, 0x77, 0x97, 0xba, 0x24, 0x44, 0xdd, 0xed, 0xef, 0x15, 0xc8, 0x98, 0x61, 0xc0,
	0x1d, 0xce, 0x84, 0xa2, 0x23, 0x80, 0x99, 0x4f, 0x6c, 0x4a, 0x9c, 0x1b, 0x9b, 0x76, 0xeb, 0x02,
	0xb2, 0x15, 0x59, 0x4c, 0xca, 0xdd, 0xeb, 0x95, 0x13, 0xbb, 0x95, 0xd0, 0x1d, 0x59, 0x4c, 0x6a,
	0x3c, 0x86, 0x76, 0x4a, 0x74, 0x3c, 0x2c, 0x52, 0x35, 0xae, 0x40, 0x4b, 0xfd, 0x97, 0x2e, 0xd3,
	0xf0, 0x0c, 0x76, 0xd3, 0x64, 0x03, 0x16, 0xca, 0x99, 0xee, 0x17, 0x98, 0xa6, 0x67, 0x70, 0x36,
	0xda, 0x78, 0x07, 0x7a, 0xe6, 0x3a, 0x47, 0x00, 0x6e, 0x6a, 0x2a, 0x95, 0x69, 0xfa, 0x4b, 0x82,
	0x66, 0x2c, 0xc0, 0x86, 0xa2, 0x51, 0x61, 0x6b, 0x65, 0x85, 0x95, 0xb7, 0x29, 0xec, 0x33, 0xe8,
	0xe4, 0x48, 0x08, 0x21, 0x15, 0xdc, 0xce, 0x72, 0x28, 0x48, 0xad, 0x3c, 0x2c, 0xb5, 0x5a, 0x94,
	0xfa, 0x10, 0x20, 0xe6, 0x5f, 0x22, 0x74, 0x0f, 0x1a, 0xd8, 0x9b, 0x93, 0x80, 0xb9, 0x58, 0x32,
	0xa9, 0x0a, 0x7c, 0x69, 0x7c, 0x86, 0x8e, 0xc9, 0x48, 0x7c, 0x5d, 0xc6, 0x8d, 0x5c, 0xcc, 0x7f,
	0x0f, 0x1a, 0x3e, 0x3b, 0xcd, 0x89, 0xd7, 0x84, 0x51, 0xe5, 0xdb, 0x71, 0x49, 0x5e, 0xf2, 0x66,
	0x5e, 0xc6, 0x08, 0xda, 0x31, 0x33, 0x51, 0x91, 0x7c, 0x2f, 0x4a, 0x5b, 0xf7, 0xa2, 0xf1, 0x02,
	0x9a, 0x98, 0x04, 0x2b, 0x56, 0x69, 0x82, 0x0e, 0xa0, 0xe9, 0x47, 0x6b, 0x41, 0xb4, 0x89, 0x93,
	0xfd, 0xcb, 0x33, 0x50, 0x43, 0xfd, 0x51, 0x13, 0xea, 0x93, 0x8f, 0x9f, 0xa6, 0xfa, 0x0e, 0x6a,
	0x80, 0x3c, 0xb2, 0xa6, 0xba, 0x84, 0x5a, 0xa0, 0x4c, 0xcc, 0xe9, 0xe0, 0x42, 0xaf, 0x71, 0xdb,
	0xe4, 0x7a, 0xaa, 0xcb, 0x08, 0x40, 0x1d, 0x5a, 0x97, 0xd6, 0xd4, 0xd2, 0xeb, 0xfd, 0x9f, 0x6c,
	0xc4, 0x17, 0xee, 0xcc, 0xf7, 0x90, 0x05, 0xfa, 0x40, 0xa8, 0x9f, 0x99, 0xb5, 0xea, 0x4e, 0x3c,
	0xf8, 0xaf, 0xe0, 0x0a, 0xdf, 0x89, 0x1d, 0x0e, 0x73, 0x2d, 0xaa, 0xf4, 0x6f, 0x30, 0x23, 0xd0,
	0x87, 0x64, 0x4e, 0x72, 0x30, 0xbd, 0x4a, 0x98, 0xf1, 0xb0, 0x12, 0xe8, 0x3d, 0x68, 0xe7, 0xee,
	0xd2, 0xd9, 0x16, 0xa6, 0x9a, 0xaa, 0x20, 0xa5, 0xf1, 0x92, 0x66, 0xb0, 0x4a, 0x6f, 0x3d, 0x38,
	0xaa, 0x04, 0xe1, 0xc7, 0x19, 0x90, 0x09, 0x5a, 0xa8, 0x75, 0x32, 0x83, 0x55, 0x1d, 0x51, 0x99,
	0x17, 0x83, 0x08, 0x75, 0xfe, 0x7b, 0x88, 0x01, 0x68, 0xa1, 0xc6, 0x09, 0xc4, 0x7e, 0x05, 0xc4,
	0x03, 0xfa, 0x0e, 0xa1, 0xcd, 0xf5, 0xdd, 0x06, 0xa2, 0x8a, 0xa0, 0xa0, 0xd2, 0xe6, 0xd2, 0x24,
	0x28, 0xe5, 0xba, 0xf6, 0x2a, 0x00, 0x22, 0x55, 0x2f, 0xd8, 0x27, 0x25, 0x06, 0x3b, 0x53, 0xa0,
	0xc3, 0xe2, 0x91, 0xec, 0xe4, 0x57, 0x26, 0xf5, 0x01, 0xf4, 0x73, 0x42, 0x67, 0xb7, 0x29, 0x50,
	0x80, 0x1e, 0x15, 0x62, 0xa3, 0x07, 0xe6, 0xcf, 0xc5, 0x1e, 0x41, 0x2b, 0xf9, 0x3b, 0xd1, 0x93,
	0x22, 0x9f, 0xc2, 0xaf, 0xba, 0x21, 0x52, 0xfc, 0x04, 0x18, 0x3b, 0x5f, 0x54, 0xf1, 0x47, 0xbf,
	0xf9, 0x1d, 0x00, 0x00, 0xff, 0xff, 0x51, 0x11, 0x71, 0x2f, 0xc8, 0x07, 0x00, 0x00,
}