Python script code: Written by me

    filename = 'data/TOM TIT TOT.txt'
    file = open(filename, 'rt', encoding="utf-8")
    text = file.read()
    file.close()
    text = text.replace("“", '').replace("”", "")
    words = text.split()
    import string

    stop_words = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn']
    table = str.maketrans('', '', string.punctuation)
    words = [w.translate(table) for w in words]
    words = [w.lower() for w in words]
    words = [w for w in words if not w in stop_words]
    di = {key: words.count(key) for key in words}
    di = dict(sorted(di.items(), key= lambda item:item[1], reverse=True))
    di=[{"Word": word, "Num": words.count(word)} for word in di];

    import csv

    keys = di[0].keys()
    with open('TomTitTot.csv', 'w', newline='', encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(di)


resources:

https://machinelearningmastery.com/clean-text-machine-learning-python/
https://www.codegrepper.com/code-examples/python/how+to+convert+a+python+array+into+csv+file
https://gist.github.com/mcescalante/7921270
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
https://www.d3-graph-gallery.com/graph/custom_color.html
