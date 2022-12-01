package main

import (
	"fmt"
	"io"
	"os"
	"sort"
	"strconv"
	"strings"
)

func getData() (data [][]int, err error) {

	file, err := os.Open(fmt.Sprintf("day1.txt", day))
	if err != nil {
		return [][]int{}, err
	}
	defer file.Close()

	content, err := io.ReadAll(file)
	if err != nil {
		return [][]int{}, err
	}

	strData := string(content)
	strData = strings.TrimSpace(strData)

	rawchunks := strings.Split(strData, "\n\n")
	elves := [][]int{}
	for _, v := range rawchunks {
		chunk := strings.Split(v, "\n")
		calories := []int{}
		for _, v := range chunk {
			amt, err := strconv.Atoi(v)
			if err != nil {
				fmt.Println(err)
				return [][]int{}, err
			}
			calories = append(calories, amt)
		}
		elves = append(elves, calories)
	}

	return elves, nil
}

func getElfCalories(calories []int) (totalCalories int) {
	totalCalories = 0
	for _, c := range calories {
		totalCalories += c
	}
	return totalCalories
}

func getHighestElfCalories(data [][]int) (elfIndex int, calories int) {
	highestElfIndex := 0
	highestElfCalories := 0
	for i, elf := range data {
		calories = getElfCalories(elf)
		if calories > highestElfCalories {
			highestElfIndex = i
			highestElfCalories = calories
		}
	}
	return highestElfIndex, highestElfCalories
}

// In the nested array, first index is the elf index and second is the calorie count
func addToTop3(currentTop3 [][]int, contender []int) (top3 [][]int) {
	contenders := append(currentTop3, contender)
	sort.Slice(contenders, func(p, q int) bool {
		return contenders[p][1] > contenders[q][1]
	})
	return contenders[:3]
}

func getTop3ElvesTotal(data [][]int) (top3 [][]int, total int) {
	top3 = [][]int{
		{0, 0},
		{0, 0},
		{0, 0},
	}
	for i, elf := range data {
		top3 = addToTop3(top3, []int{i, getElfCalories((elf))})
	}

	totalTop3 := 0
	for _, top := range top3 {
		totalTop3 += top[1]
	}

	return top3, totalTop3
}

func main() {
	elfData, err := getData()
	if err != nil {
		fmt.Println((err))
		return
	}
	elfIndex, highestCalories := getHighestElfCalories(elfData)
	fmt.Println("Part 1")
	fmt.Println(elfIndex, highestCalories)

	top3, total := getTop3ElvesTotal(elfData)
	fmt.Println("Part 2")
	fmt.Println(top3)
	fmt.Println(total)
}
