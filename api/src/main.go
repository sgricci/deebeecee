package main

import (
	"crypto/rand"
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"log"
	"net/http"
	"strconv"
	"time"
)

func main() {
	fmt.Println("Running on port 3001!")
	i := Impl{}
	i.InitDB()
	i.InitSchema()

	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	router, err := rest.MakeRouter(
		&rest.Route{"GET", "/lists", i.GetAllLists},
		&rest.Route{"GET", "/list/:id", i.GetList},
		&rest.Route{"GET", "/list/:id/items", i.GetListItems},
		&rest.Route{"POST", "/list", i.PostList},
		&rest.Route{"PUT", "/list/:id", i.PutList},
		&rest.Route{"DELETE", "/list/:id", i.DeleteList},
		&rest.Route{"GET", "/items", i.GetAllItems},
		&rest.Route{"GET", "/item/:id", i.GetItem},
		&rest.Route{"POST", "/item", i.PostItem},
		&rest.Route{"PUT", "/item/:id", i.PutItem},
		&rest.Route{"DELETE", "/item/:id", i.DeleteItem},
	)
	if err != nil {
		log.Fatal(err)
	}
	api.SetApp(router)

	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("../../web"))))
	log.Fatal(http.ListenAndServe(":3001", nil))
}

type List struct {
	Id        int64     `json:"id"`
	Name      string    `sql:"size:255" json:"name"`
	CreatedOn time.Time `json:"created_on"`
	ReadKey   string    `sql:"size:32" json:"read_key"`
	RwKey     string    `sql:"size:32" json:"rw_key"`
}

type Item struct {
	Id     int64  `json:"id"`
	ListId int64  `json:"list_id"`
	Item   string `sql:"size:255" json:"item"`
	B      int    `json:"b"`
	D      int    `json:"d"`
	C      int    `json:"c"`
}

type Impl struct {
	DB gorm.DB
}

func randToken() string {
	b := make([]byte, 8)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}

func (i *Impl) InitDB() {
	var err error
	i.DB, err = gorm.Open("mysql", "root:root@/starfish_prime?charset=utf8&parseTime=True")
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}
	i.DB.LogMode(true)

}

func (i *Impl) InitSchema() {
	i.DB.AutoMigrate(&List{})
	i.DB.AutoMigrate(&Item{})
}

func (i *Impl) CheckAuth(list_id int64, rw_key string) bool {
	list := List{}
	if i.DB.Where("id = ?", list_id).Find(&list).Error != nil {
		return false
	}
	if list.RwKey != rw_key {
		return false
	}
	return true
}

func (i *Impl) GetAllLists(w rest.ResponseWriter, r *rest.Request) {
	lists := []List{}
	i.DB.Find(&lists)
	w.WriteJson(&lists)
}

func (i *Impl) GetList(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	list := List{}
	if i.DB.First(&list, id).Error != nil {
		rest.NotFound(w, r)
		return
	}
	w.WriteJson(&list)
}

func (i *Impl) PostList(w rest.ResponseWriter, r *rest.Request) {

	list := List{}
	if err := r.DecodeJsonPayload(&list); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	list.ReadKey = randToken()
	list.RwKey = randToken()

	if err := i.DB.Save(&list).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&list)
}

func (i *Impl) PutList(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	list := List{}
	if i.DB.First(&list, id).Error != nil {
		rest.NotFound(w, r)
		return
	}

	updated := List{}
	if err := r.DecodeJsonPayload(&updated); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	str_id, err := strconv.Atoi(id)
	if err != nil {
		rest.Error(w, "Invalid List ID", http.StatusInternalServerError)
		return
	}
	if i.CheckAuth(int64(str_id), r.Request.Header.Get("RwKey")) == false {
		rest.Error(w, "Auth Check Failed", http.StatusInternalServerError)
		return
	}

	list.Name = updated.Name

	if err := i.DB.Save(&list).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&list)
}

func (i *Impl) DeleteList(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	list := List{}
	if i.DB.First(&list, id).Error != nil {
		rest.NotFound(w, r)
		return
	}

	str_id, err := strconv.Atoi(id)
	if err != nil {
		rest.Error(w, "Invalid List ID", http.StatusInternalServerError)
		return
	}
	if i.CheckAuth(int64(str_id), r.Request.Header.Get("RwKey")) == false {
		rest.Error(w, "Auth Check Failed", http.StatusInternalServerError)
		return
	}

	if err := i.DB.Delete(&list).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (i *Impl) GetListItems(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	items := []Item{}
	if i.DB.Where("list_id = ?", id).Find(&items).Error != nil {
		rest.NotFound(w, r)
		return
	}
	w.WriteJson(&items)
}

func (i *Impl) GetAllItems(w rest.ResponseWriter, r *rest.Request) {
	items := []Item{}
	i.DB.Find(&items)
	w.WriteJson(&items)
}

func (i *Impl) GetItem(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	item := Item{}
	if i.DB.First(&item, id).Error != nil {
		rest.NotFound(w, r)
		return
	}
	w.WriteJson(&item)
}
func (i *Impl) PostItem(w rest.ResponseWriter, r *rest.Request) {
	item := Item{}
	if err := r.DecodeJsonPayload(&item); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if i.CheckAuth(item.ListId, r.Request.Header.Get("RwKey")) == false {
		rest.Error(w, "Auth Check Failed", http.StatusInternalServerError)
		return
	}
	if err := i.DB.Save(&item).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&item)
}
func (i *Impl) PutItem(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	item := Item{}
	if i.DB.First(&item, id).Error != nil {
		rest.NotFound(w, r)
		return
	}

	updated := Item{}
	if err := r.DecodeJsonPayload(&updated); err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if i.CheckAuth(item.ListId, r.Request.Header.Get("RwKey")) == false {
		rest.Error(w, "Auth Check Failed", http.StatusInternalServerError)
		return
	}

	item.Item = updated.Item
	item.ListId = updated.ListId
	item.B = updated.B
	item.D = updated.D
	item.C = updated.C

	if err := i.DB.Save(&item).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteJson(&item)
}
func (i *Impl) DeleteItem(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	item := Item{}
	if i.DB.First(&item, id).Error != nil {
		rest.NotFound(w, r)
		return
	}

	if i.CheckAuth(item.ListId, r.Request.Header.Get("RwKey")) == false {
		rest.Error(w, "Auth Check Failed", http.StatusInternalServerError)
		return
	}

	if err := i.DB.Delete(&item).Error; err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
