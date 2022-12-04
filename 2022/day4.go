package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

func isRangeSubset(ranges [][]int) bool {
	stop1 := ranges[0][1]
	stop2 := ranges[1][1]
	// ..XXXXXXXX..
	// .....XXXXX..
	return stop2 <= stop1
}

func part1(data [][][]int) {
	fmt.Println("Part 1:")
	containedCount := 0
	for _, r := range data {
		if isRangeSubset(r) {
			containedCount++
		}
	}
	fmt.Println(containedCount)
}

func hasAnyOverlap(ranges [][]int) bool {
	stop1 := ranges[0][1]
	start2 := ranges[1][0]
	// ...XXX.......
	// .........XXXX
	return start2 <= stop1
}

func part2(data [][][]int) {
	fmt.Println("Part 2:")
	containedCount := 0
	for _, r := range data {
		if hasAnyOverlap(r) {
			containedCount++
		}
	}
	fmt.Println(containedCount)
}

func convertLine(input string) [][]int {
	rangeEndpoints := strings.Split(strings.Replace(input, ",", "-", 1), "-")
	var ints []int
	for _, val := range rangeEndpoints {
		num, err := strconv.Atoi(val)
		if err != nil {
			fmt.Println("Uh oh - couldn't get an int for val", val)
			panic("Problem converting numerical input")
		}
		ints = append(ints, num)
	}
	elves := [][]int{ints[:2], ints[2:]}
	// Sort so earlier range is first
	sort.Slice(elves, func(p, q int) bool {
		if elves[p][0] == elves[q][0] {
			// If starts are the same, fullest range first
			return elves[p][1] > elves[q][1]
		}
		return elves[p][0] < elves[q][0]
	})
	return elves
}

func getData() ([][][]int, error) {
	var lines [][][]int

	file, err := os.Open("day4.txt")
	if err != nil {
		return lines, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		pair := scanner.Text()
		lines = append(lines, convertLine(pair))
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
