package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

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

	productName := "SSD NVMe 1TB"

	normalPrice := 850000
	currentPrice := 35000

	discount := float64(normalPrice-currentPrice) /
		float64(normalPrice)

	if discount >= 0.90 {

		text := fmt.Sprintf(
`🔥 DISKON GILA

%s

Normal : Rp%d
Sekarang : Rp%d
Diskon : %.1f%%`,
			productName,
			normalPrice,
			currentPrice,
			discount*100,
		)

		msg := tgbotapi.NewMessage(chatID, text)

		_, err = bot.Send(msg)

		if err != nil {
			log.Fatal(err)
		}
	}

}
