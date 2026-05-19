package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/gocolly/colly/v2"
)

const (
	botToken := os.Getenv("BOT_TOKEN")

chatIDStr := os.Getenv("CHAT_ID")
chatID, _ := strconv.ParseInt(chatIDStr,10,64)
)

func parsePrice(s string) int {

	s = strings.ReplaceAll(s, "Rp", "")
	s = strings.ReplaceAll(s, ".", "")
	s = strings.ReplaceAll(s, ",", "")
	s = strings.TrimSpace(s)

	n, _ := strconv.Atoi(s)

	return n
}

func main() {

	bot, err := tgbotapi.NewBotAPI(botToken)

	if err != nil {
		log.Fatal(err)
	}

	c := colly.NewCollector()

	c.OnHTML("div.shopee-search-item-result__item", func(e *colly.HTMLElement) {

		name := e.ChildText("div[data-sqe='name']")

		currentPriceText := e.ChildText(".ZEgDH9")
		oldPriceText := e.ChildText(".Y3DvsN")

		currentPrice := parsePrice(currentPriceText)
		oldPrice := parsePrice(oldPriceText)

		if currentPrice == 0 || oldPrice == 0 {
			return
		}

		discount := float64(oldPrice-currentPrice) / float64(oldPrice)

		if discount >= 0.90 {

			text := fmt.Sprintf(
				"🔥 DISKON GILA\n\n%s\n\nNormal: Rp%d\nSekarang: Rp%d\nDiskon: %.2f%%",
				name,
				oldPrice,
				currentPrice,
				discount*100,
			)

			msg := tgbotapi.NewMessage(chatID, text)

			bot.Send(msg)

			fmt.Println(text)
		}

	})

	err = c.Visit("https://shopee.co.id/flash_sale")

	if err != nil {
		log.Fatal(err)
	}

}
