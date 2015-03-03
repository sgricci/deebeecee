package main

import (
	"fmt"
	"github.com/astaxie/beego/orm"
	"github.com/dougblack/sleepy"
	_ "github.com/go-sql-driver/mysql"
	"net/http"
	"net/url"
)

type Item struct{}

func (item Item) Get(values url.Values, headers http.Header) (int, interface{}, http.Header) {
	items := []string{"item1", "item2"}
	data := map[string][]string{"items": items}
	return 200, data, http.Header{"Content-type": {"application/json"}}
}

func main() {
	item := new(Item)

	api := sleepy.NewAPI()
	api.AddResource(item, "/items")
	api.Start(3000)
}
