class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(array) {
        this.root = this.#buildTree(array);
    }

    #buildTree(array) {
        if (array.length === 0) return null;

        const sortedArray = this.#cleanSort(array);
        const midIndex = Math.floor(sortedArray.length / 2);
        const root = new Node(sortedArray[midIndex]);
        root.left = this.#buildTree(sortedArray.slice(0, midIndex));
        root.right = this.#buildTree(sortedArray.slice(midIndex + 1));

        return root;
    }

    #cleanSort(array) {
        return [...new Set(array)].sort((a, b) => a - b);
    }

    includes(value, current = this.root) {
        if (current === null) return false;
        if (current.data === value) return true;
        if (current.data < value) {
            return this.includes(value, current.right)
        }
        if (current.data > value) {
            return this.includes(value, current.left)
        }
        return false;
    }

    insert(value, current = this.root) {
        if (current.data < value) {
            if (current.right === null) {
                current.right = new Node(value);
                return;
            }
            return this.insert(value, current.right)
        }
        if (current.data > value) {
            if (current.left === null) {
                current.left = new Node(value);
                return;
            }
            return this.insert(value, current.left)
        }
        if (current.data === value) return;
        return;
    }

    deleteItem(value) {
        this.root = this.#deleteNode(value, this.root);
    }

    #deleteNode(value, current) {
        if (current === null) return null;

        if (value < current.data) {
            current.left = this.#deleteNode(value, current.left);
        } else if (value > current.data) {
            current.right = this.#deleteNode(value, current.right);
        } else {
            if (current.left === null) return current.right;
            if (current.right === null) return current.left;

            let successor = current.right;
            while (successor.left !== null) {
                successor = successor.left;
            }

            current.data = successor.data;
            current.right = this.#deleteNode(successor.data, current.right);
        }

        return current;
    }

    levelOrderForEach(callback) {
        if (this.root === null) return;
        if (typeof callback !== "function") {
            throw new Error("Callback function required");
        }
        let queue = [];
        queue.push(this.root);
        while (queue.length > 0) {
            const current = queue.shift();
            callback(current.data);
            if (current.left) {
                queue.push(current.left);
            }
            if (current.right) {
                queue.push(current.right);
            }
        }
    }

    inOrderForEach(callback, current = this.root) {
        if (current === null) return;
        if (typeof callback !== "function") {
            throw new Error("Callback function required");
        }
        if (current.left) {
            this.inOrderForEach(callback, current.left);
        }
        callback(current.data);
        if (current.right) {
            this.inOrderForEach(callback, current.right);
        }
    }

    preOrderForEach(callback, current = this.root) {
        if (current === null) return;
        if (typeof callback !== "function") {
            throw new Error("Callback function required");
        }
        callback(current.data);
        if (current.left) {
            this.preOrderForEach(callback, current.left);
        }
        if (current.right) {
            this.preOrderForEach(callback, current.right);
        }
    }

    postOrderForEach(callback, current = this.root) {
        if (current === null) return;
        if (typeof callback !== "function") {
            throw new Error("Callback function required");
        }
        if (current.left) {
            this.postOrderForEach(callback, current.left);
        }
        if (current.right) {
            this.postOrderForEach(callback, current.right);
        }
        callback(current.data);
    }

    height(value, current = this.root) {
        if (current === null) {
            return undefined;
        }
        if (value < current.data) {
            return this.height(value, current.left);
        }
        if (value > current.data) {
            return this.height(value, current.right);
        }
        if (current.data === value) {
            return this.#calculateHeight(current);
        }
    }

    depth(value, current = this.root, count = 0) {
        if (current === null) {
            return undefined;
        }
        if (current.data === value) {
            return count;
        }
        count++;
        if (value < current.data) {
            return this.depth(value, current.left, count);
        }
        if (value > current.data) {
            return this.depth(value, current.right, count);
        }
    }

    isBalanced(current = this.root) {
        if (current === null) return true;
        const leftHeight = this.#calculateHeight(current.left);
        const rightHeight = this.#calculateHeight(current.right);
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return false;
        }
        return this.isBalanced(current.left) && this.isBalanced(current.right);
    }

    rebalance() {
        const sortedValues = [];
        this.inOrderForEach((val) => sortedValues.push(val));
        this.root = this.#buildTree(sortedValues);
    }

    #calculateHeight(node) {
        if (node === null) return -1;

        const leftHeight = this.#calculateHeight(node.left);
        const rightHeight = this.#calculateHeight(node.right);

        return 1 + Math.max(leftHeight, rightHeight);
    }
}



const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null || node === undefined) {
        return;
    }
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
};

const tree = new Tree([1, 7, 4, 23, 8, 9, 3, 5]);
prettyPrint(tree.root);

console.log(tree.includes(9));
console.log(tree.includes(90));

tree.insert(100);
prettyPrint(tree.root);

tree.deleteItem(100);
tree.deleteItem(4);
tree.deleteItem(7);
prettyPrint(tree.root);

tree.levelOrderForEach((val) => console.log(val));
tree.inOrderForEach((val) => console.log(val));
tree.preOrderForEach((val) => console.log(val));
tree.postOrderForEach((val) => console.log(val));

console.log(tree.height(23));
console.log(tree.height(8));
console.log(tree.depth(8));
console.log(tree.depth(9));

console.log("Is balanced before rebalance:", tree.isBalanced());
tree.rebalance();
console.log("Is balanced after rebalance:", tree.isBalanced());
prettyPrint(tree.root);