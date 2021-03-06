import sqlite3
import yaml
import string
import os
import xlrd
import urllib2
from bs4 import BeautifulSoup

states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nevada", "New_Hampshire", "New_Jersey", "New_Mexico", "New_York", "North_Carolina", "North_Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode_Island", "South_Carolina", "South_Dakota",  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington_State", "West_Virginia", "Wisconsin", "Wyoming"]


def loadData():
    conn = sqlite3.connect('congress.db')
    c = conn.cursor()
    for i in range (0, len(states)-1):
        c.execute('CREATE TABLE '+states[i]+' (name text, district text, party text, position text, website text)')
        for k in range(0, 2):
            if (k==0):
                branch = "_House_of_Representatives"
            else:
                branch = "_Senate"
            print states[i]+branch
            table = buildTable(states[i], branch)
            soup = BeautifulSoup(str(table))
            ths = soup.find_all('th')
            districtIndex = -1
            partyIndex = -1
            nameIndex = -1
            start = 1
            x = 0
            if (((states[i]=="Virginia") or (states[i]=="West_Virginia")) and (branch == "_House_of_Representatives")):
                tds = soup.find_all('td')
                while(partyIndex ==-1 or nameIndex==-1 or districtIndex==-1):
                    tdsSoup = BeautifulSoup(str(tds[x]))
                    for text in tdsSoup.findAll(text=True):
                        temp = text
                        break
                    if ((string.find(temp,"Name")!=-1) or (string.find(temp,"Senator")!=-1) or (string.find(temp,"Representative")!=-1) or (string.find(temp,"Delegate")!=-1)):
                        nameIndex = x
                    elif ((string.find(temp, "Party")!=-1) or (string.find(temp,"Pty")!=-1)):
                        partyIndex = x
                    elif (string.find(temp,"District")!=-1):
                        districtIndex = x
                    x+=1
            elif (string.find(str(table),"wikitable collapsible sortable")!=-1):
                x =1
                start = 2
                while(partyIndex ==-1 or nameIndex==-1 or districtIndex==-1):
                    thsSoup = BeautifulSoup(str(ths[x]))
                    for text in thsSoup.findAll(text=True):
                        temp = text
                        break
                    if ((string.find(temp,"Name")!=-1) or (string.find(temp,"Senator")!=-1) or (string.find(temp,"Representative")!=-1) or (string.find(temp,"Delegate")!=-1)):
                        nameIndex = x-1
                    elif ((string.find(temp, "Party")!=-1) or (string.find(temp,"Pty")!=-1)):
                        partyIndex = x-1
                    elif (string.find(temp,"District")!=-1):
                        districtIndex = x-1
                    x+=1
            else:
                while(partyIndex ==-1 or nameIndex==-1 or districtIndex==-1):
                    thsSoup = BeautifulSoup(str(ths[x]))
                    for text in thsSoup.findAll(text=True):
                        temp = text
                        break
                    if ((string.find(temp,"Name")!=-1) or (string.find(temp,"Senator")!=-1) or (string.find(temp,"Representative")!=-1) or (string.find(temp,"Delegate")!=-1)):
                        nameIndex = x
                    elif ((string.find(temp, "Party")!=-1) or (string.find(temp,"Pty")!=-1)):
                        partyIndex = x
                    elif (string.find(temp,"District")!=-1):
                        districtIndex = x
                    x+=1
            trs = soup.find_all('tr')
            for y in range (start,len(trs)-1):
                tempSoup = BeautifulSoup(str(trs[y]))
                tds = tempSoup.find_all('td')
                for z in range (0,len(tds)-1):
                    cell = tds[z]
                    cellSoup = BeautifulSoup(str(cell))
                    if z==nameIndex:
                        for text in cellSoup.findAll(text=True):
                            if (text!=" "):
                                name = text
                                break
                        link = ""
                        for a in cellSoup.find_all('a',"href"==True):
                            link = a["href"]
                    elif z==partyIndex:
                        for text in cellSoup.findAll(text=True):
                            if (text!=" "):
                                party = text
                                break
                    elif z==districtIndex:
                        for text in cellSoup.findAll(text=True):
                            district = text
                            break
                district = district.strip(string.whitespace)
                link = "http://ballotpedia.org"+link
                if (branch=="_House_of_Representatives"):
                    if ((states[i]=="Maryland") or (states[i]=="Virginia")):
                        c.execute('INSERT INTO ' + states[i] + ' VALUES (?,?,?,?,?)', (name, district, party, "Delegate", link))
                    else:
                        c.execute('INSERT INTO ' + states[i] + ' VALUES (?,?,?,?,?)', (name, district, party, "Representative", link))
                else:
                    c.execute('INSERT INTO ' + states[i] + ' VALUES (?,?,?,?,?)', (name, district, party, "Senator", link))
    
def buildTable(state, branch):
    site = "http://ballotpedia.org/wiki/index.php/"+state+branch
    hdr = {'User-Agent': 'Mozilla/5.0'}
    req = urllib2.Request(site,headers=hdr)
    page = urllib2.urlopen(req)
    soup = BeautifulSoup(page)
    tables = soup.find_all('table')
    for i in range(0,len(tables)-1):
        if ((string.find(str(tables[i]),"District")!=-1) and
            (string.find(str(tables[i]),"Party")!=-1)):
            if ((state=="Vermont") and (branch=="_Senate")):
                if (string.find(str(tables[i]),"Current members,")!=-1):
                    table = tables[i]
            else:
                table = tables[i]
    return table

def showTables():
    conn = sqlite3.connect('congress.db')
    c = conn.cursor()
    #list = c.execute('SELECT * FROM sqlite_master WHERE type="table"')
    list = c.execute('SELECT * FROM California')
    for item in list:
        print item

def nationalCongress():
    stream = open("congress_current.yaml", 'r')
    congress = yaml.load(stream)
    stream.close()
    conn = sqlite3.connect('congress.db')
    c = conn.cursor()
    c.execute('DROP TABLE Representatives')
    c.execute('DROP TABLE Senators')
    c.execute('CREATE TABLE Representatives (name text, gender text, birthday text, start text, state text, party text, district text)')
    c.execute('CREATE TABLE Senators (name text, gender text, birthday text, start text, state text, party text)')
    for item in congress:
        name = item["name"]["first"]+" "+item["name"]["last"]
        gender = item["bio"]["gender"]
        if (gender=="F"):
            gender = "Female"
        else:
            gender = "Male"
        birthday = item["bio"]["birthday"].strip("'")
        start = item["terms"][0]["start"].strip("'")
        state = item["terms"][0]["state"]
        party = item["terms"][0]["party"]
        party = str(party)
        gender = str(gender)
        birthday = str(birthday)
        start = str(start)
        if (item["terms"][0]["type"]=="rep"):
            district = item["terms"][0]["district"]
            district = str(district)
            c.execute('INSERT INTO Representatives VALUES (?,?,?,?,?,?,?)', (name, gender, birthday, start, state, party, district))
        if (item["terms"][0]["type"]=="sen"):
            c.execute('INSERT INTO Senators VALUES (?,?,?,?,?,?)', (name, gender, birthday, start, state, party))
        conn.commit()

def addNebraska():
    conn = sqlite3.connect('congress.db')
    c = conn.cursor()
    c.execute('CREATE TABLE Nebraska (name text, district text, position text, website text)')
    site = "http://ballotpedia.org/wiki/index.php/Nebraska_Senate"
    hdr = {'User-Agent': 'Mozilla/5.0'}
    req = urllib2.Request(site,headers=hdr)
    page = urllib2.urlopen(req)
    soup = BeautifulSoup(page)
    tables = soup.find_all('table')
    for i in range(0,len(tables)-1):
        if ((string.find(str(tables[i]),"District")!=-1) and
            (string.find(str(tables[i]),"Representative")!=-1) and
            (string.find(str(tables[i]),"First elected")!=-1)):
            table = tables[i]
    soup = BeautifulSoup(str(table))
    districtIndex = 0
    nameIndex = 1
    trs = soup.find_all('tr')
    for y in range (1,len(trs)-1):
        tempSoup = BeautifulSoup(str(trs[y]))
        tds = tempSoup.find_all('td')
        for z in range (0,len(tds)-1):
            cell = tds[z]
            cellSoup = BeautifulSoup(str(cell))
            if z==nameIndex:
                for text in cellSoup.findAll(text=True):
                    if (text!=" "):
                        name = text
                        break
                link = ""
                for a in cellSoup.find_all('a',"href"==True):
                    link = a["href"]
            elif z==districtIndex:
                for text in cellSoup.findAll(text=True):
                    district = text
                    break
        district = district.strip(string.whitespace)
        link = "http://ballotpedia.org"+link
        c.execute('INSERT INTO Nebraska VALUES (?,?,?,?)', (name, district, "Senator", link))

#loadData()
#nationalCongress()
showTables()
