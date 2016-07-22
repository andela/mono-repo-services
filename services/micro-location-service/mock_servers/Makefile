
all: gen_stubs

gen_stubs:
		protoc --go_out=plugins=grpc:. assessment/*.proto
		protoc --go_out=plugins=grpc:. authentication/*.proto
		protoc --go_out=plugins=grpc:. authorization/*.proto
		protoc --go_out=plugins=grpc:. fellowship_roles/*.proto
		protoc --go_out=plugins=grpc:. placements/*.proto
		protoc --go_out=plugins=grpc:. users/*.proto
		protoc --go_out=plugins=grpc:. settings/*.proto
		protoc --go_out=plugins=grpc:. progress/*.proto
clean:
