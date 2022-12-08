package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func isEdge(maxRow int, maxCol int, row int, col int) bool {
	return row == 0 || col == 0 || row == maxRow || col == maxCol
}

func isBlocking(pathTree int, thisTree int) bool {
	return pathTree >= thisTree
}

func isTreeVisible(grid [][]int, row int, col int) bool {
	maxRow := len(grid) - 1
	maxCol := len(grid[0]) - 1
	thisTree := grid[row][col]

	if isEdge(maxRow, maxCol, row, col) {
		return true
	}

	// Top down
	for r := 0; r < row; r++ {
		if isBlocking(grid[r][col], thisTree) {
			break
		}
		if r == row-1 {
			return true
		}
	}
	// Bottom up
	for r := maxRow; r > row; r-- {
		if isBlocking(grid[r][col], thisTree) {
			break
		}
		if r == row+1 {
			return true
		}
	}
	// Left -> right
	for c := 0; c < col; c++ {
		if isBlocking(grid[row][c], thisTree) {
			break
		}
		if c == col-1 {
			return true
		}
	}
	// Right -> left
	for c := maxCol; c > col; c-- {
		if isBlocking(grid[row][c], thisTree) {
			break
		}
		if c == col+1 {
			return true
		}
	}
	return false
}

func part1(grid [][]int) {
	fmt.Println("Part 1:")
	visibleTrees := 0
	for r := 0; r < len(grid); r++ {
		for c := 0; c < len(grid[0]); c++ {
			if isTreeVisible(grid, r, c) {
				visibleTrees++
			}
		}
	}
	fmt.Println(visibleTrees)
}

func getTreeScore(grid [][]int, row int, col int) int {
	maxRow := len(grid) - 1
	maxCol := len(grid[0]) - 1
	thisTree := grid[row][col]

	if isEdge(maxRow, maxCol, row, col) {
		return 0
	}

	// Look Up
	top := 0
	for r := row - 1; r > -1; r-- {
		top++
		if isBlocking(grid[r][col], thisTree) {
			break
		}
	}

	// Look Down
	bottom := 0
	for r := row + 1; r < len(grid); r++ {
		bottom++
		if isBlocking(grid[r][col], thisTree) {
			break
		}
	}

	// Look Left
	left := 0
	for c := col - 1; c > -1; c-- {
		left++
		if isBlocking(grid[row][c], thisTree) {
			break
		}
	}

	// Look Right
	right := 0
	for c := col + 1; c < len(grid[0]); c++ {
		right++
		if isBlocking(grid[row][c], thisTree) {
			break
		}
	}

	return top * bottom * left * right
}

func part2(grid [][]int) {
	fmt.Println("Part 2:")
	topTreeScore := 0
	for r := 0; r < len(grid); r++ {
		for c := 0; c < len(grid[0]); c++ {
			treeScore := getTreeScore(grid, r, c)
			if treeScore > topTreeScore {
				topTreeScore = treeScore
			}
		}
	}
	fmt.Println(topTreeScore)
}

func getLine(l string) []int {
	nums := make([]int, 0)
	chars := strings.Split(l, "")
	for _, c := range chars {
		num, err := strconv.Atoi(c)
		if err != nil {
			fmt.Println(num)
			panic("Could not parse int")
		}
		nums = append(nums, num)
	}
	return nums
}

func getData() ([][]int, error) {
	var grid [][]int

	file, err := os.Open("day8.txt")
	if err != nil {
		return grid, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		grid = append(grid, getLine(line))
	}
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "reading file:", err)
		return grid, err
	}

	return grid, nil
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
