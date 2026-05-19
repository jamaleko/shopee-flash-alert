package main

import (
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
    "strconv"

    tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

type Item struct {
	Name      string `json:"name"`
	Price     int64  `json:"price"`
	PriceBefore int64 `json:"price_before_discount"`
}

type Response struct {
	Items []Item `json:"items"`
}

func main() {

	botToken := os.Getenv("BOT_TOKEN")

	chatIDStr := os.Getenv("CHAT_ID")
	chatID, err := strconv.ParseInt(chatIDStr,10,64)

	if err != nil {
		log.Fatal(err)
	}

	bot, err := tgbotapi.NewBotAPI(botToken)

	if err != nil {
		log.Fatal(err)
	}

	url := "https://shopee.co.id/api/v4/flash_sale/flash_sale_get_items"

	resp, err := http.Get(url)

	if err != nil {
		log.Fatal(err)
	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var data Response

	json.Unmarshal(body,&data)
    fmt.Println("Jumlah produk:", len(data.Items))
	for _, p := range data.Items {
     fmt.Println(
        p.Name,
        p.PriceBefore,
        p.Price,
    )
		if p.PriceBefore == 0 {
			continue
		}

		discount := float64(
			p.PriceBefore-p.Price,
		)/float64(p.PriceBefore)

		if discount >= 0.90 {

			text := fmt.Sprintf(
`🔥 DISKON GILA

%s

Normal : Rp%d
Sekarang : Rp%d
Diskon : %.1f%%`,
				p.Name,
				p.PriceBefore,
				p.Price,
				discount*100,
			)

			msg := tgbotapi.NewMessage(
				chatID,
				text,
			)

			bot.Send(msg)
		}
	}
}
