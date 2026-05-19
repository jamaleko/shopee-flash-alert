package main

import (
	"log"
	"os"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func main() {

	botToken := os.Getenv("BOT_TOKEN")

	chatIDStr := os.Getenv("CHAT_ID")
	chatID, err := strconv.ParseInt(chatIDStr, 10, 64)

	if err != nil {
		log.Fatal(err)
	}

	bot, err := tgbotapi.NewBotAPI(botToken)

	if err != nil {
		log.Fatal(err)
	}

	msg := tgbotapi.NewMessage(chatID, "🔥 Test GitHub Action berhasil")

	_, err = bot.Send(msg)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("Pesan terkirim")
}
