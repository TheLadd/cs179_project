class Node:
    depth = 0
    """
    A node of a tree.
    Contains a value, the index of it's parent (context in tree docstring),
    and a list of the indices of it's children
    """
    def __init__(self, pInd, ind, val):
        self.pInd = pInd
        self.ind = ind
        self.val = val
        self.cInds = [].copy()

    # def __gt__(self, other):
        # return self

    def getParentInd(self):
        return self.pInd

    def getIndex(self):
        return self.ind

    def addChild(self, cInd):
        """
        where c is index of new child node 
        """
        self.cInds.append(cInd)

    def __eq__(self, other):
        if type(self) != type(other):
            return False
        return self.depth == other.depth

    def __lt__(self, other):
        if type(self) != type(other):
            return False
        return self.depth < other.depth

    def __repr__(self):
        return str(self.val)

    def __str__(self):
        return str(self.val)


class Tree:
    """
    A tree that is implemented with a list. 
    The list contains Node objects (see Node docstring)
    """
    def __init__(self, root):
        """
        Where root is root Node
        """
        self.tree = [root]

    def getRoot(self):
        return self.tree[0]

    def getNode(self, i):
        return self.tree[i]

    def addNodeFrom(self, pInd, val):
        """
        Create new node as a child of tree[pInd] with a value of val
        """
        newInd = len(self.tree)
        newNode = Node(pInd, newInd, val)
        newNode.depth = self.tree[pInd].depth + 1
        
        self.tree.append(newNode)
        self.tree[pInd].addChild(newInd)
        
    def print(self):
        for i in self.tree:
            s = ""
            for j in i.cInds:
                s += str(j) + ", "
            print(f"val: {i.val} | p: {i.pInd} | c: {s}")