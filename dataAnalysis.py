import collections
import heapq

def main():
	# pretend we have sql connected, then we query from sql
	q = 'SELECT offer.startLocation, offer.endLocation;'
	data = queryFromSQL(q)

	#hash map to store index of locations
	locationIndex = collections.defaultDict()

	# build an index mapping from location to index
	for startLocation, endLocation in data:
		if not startLocation in locationIndex:
			locationIndex[len(locationIndex)] = startLocation
		if not endLocation in locationIndex:
			locationIndex[len(locationIndex)] = endLocation

	# create a n by n matrix to store the frequencies using list comprehension
	matrix = [[0 for _ in xrange(0,len(locationIndex))] for __ in xrange(0, len(locationIndex))]

	# count the frequency for each route
	for startLocation, endLocation in data:
		matrix[startLocation][endLocation] += 1

	# Then this matrix will store the frequency from one location to another
	# You can get the top 10 using a heap
	h = []

	# first we push matrix elements into the heap as (frequency, startIndex, endIndex) key-value pairs
	for i in xrange(0, len(matrix)):
		for j in xrange(0, len(matrix[i])):
			h.append((matrix[i][j],i,j))

	# now we can convert them into a heap
	heapq.heapify(h)

	# now we can get the top 10 (or any) elements in constant time
	return heapq.nlargest(10)
	



