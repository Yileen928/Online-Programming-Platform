#include <stdio.h>
#include <stdlib.h>

#define SIZE 5

void printArray(int arr[], int size);
void bubbleSort(int arr[], int size);

int main() {
    // 声明和初始化数组
    int numbers[SIZE] = {64, 34, 25, 12, 22};
    
    printf("=== Array Operations Test ===\n");
    
    // 打印原始数组
    printf("\nOriginal array: ");
    printArray(numbers, SIZE);
    
    // 排序数组
    bubbleSort(numbers, SIZE);
    
    // 打印排序后的数组
    printf("Sorted array: ");
    printArray(numbers, SIZE);
    
    return 0;
}

// 打印数组
void printArray(int arr[], int size) {
    for(int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// 冒泡排序
void bubbleSort(int arr[], int size) {
    for(int i = 0; i < size-1; i++) {
        for(int j = 0; j < size-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                // 交换元素
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}