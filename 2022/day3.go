package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type stringset = map[string]struct{}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz"

func itemTypeToPriority(item string) int {
	lowered := strings.ToLower(item)
	numeral := strings.Index(ALPHABET, lowered) + 1
	if numeral == 0 {
		fmt.Println("Uh oh - no priority found for item", item)
	}
	if item == lowered {
		return numeral
	}
	return numeral + 26
}

func singleIntersect(set1 stringset, set2 stringset) string {
	for key := range set1 {
		_, ok := set2[key]
		if ok {
			return key
		}
	}
	fmt.Println("Uh oh - no common items found")
	return ""
}

func part1(data [][]string) {
	fmt.Println("Part 1:")
	totalPriority := 0
	for _, rucksack := range data {
		halfway := len(rucksack) / 2
		compartment1 := makeSet(rucksack[:halfway])
		compartment2 := makeSet(rucksack[halfway:])
		commonItem := singleIntersect(compartment1, compartment2)
		totalPriority += itemTypeToPriority(commonItem)
	}
	fmt.Println(totalPriority)
}

func intersect(set1 stringset, set2 stringset) stringset {
	set := make(map[string]struct{})
	for key := range set1 {
		_, ok := set2[key]
		if ok {
			set[key] = struct{}{}
		}
	}
	if len(set) == 0 {
		fmt.Println("Uh oh - no intersection between sets")
	}
	return set
}

func part2(data [][]string) {
	fmt.Println("Part 2:")
	totalPriority := 0
	const GROUP_SIZE = 3
	for i := 0; i < len(data); i += GROUP_SIZE {
		rucksack1 := makeSet(data[i])
		rucksack2 := makeSet(data[i+1])
		rucksack3 := makeSet(data[i+2])
		firstIntersection := intersect(rucksack1, rucksack2)
		common := singleIntersect(firstIntersection, rucksack3)
		totalPriority += itemTypeToPriority(common)
	}
	fmt.Println(totalPriority)
}

func makeSet(slice []string) stringset {
	set := make(map[string]struct{})
	for _, str := range slice {
		set[str] = struct{}{}
	}
	return set
}

func getData() ([][]string, error) {
	var lines [][]string

	file, err := os.Open("day3.txt")
	if err != nil {
		return lines, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		items := strings.Split(line, "")
		lines = append(lines, items)
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return lines, err
	}

	return lines, nil
}

func main() {
	data, err := getData()
	if err != nil {
		fmt.Println(err)
		return
	}
	part1(data)
	part2(data)
}
