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