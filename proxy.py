#! /usr/bin/env python
print "Content-type: text/html\r\n\r\n"

from TweetPhone import TweetPhone
import cgi

form = dict([(k,v.value) for k,v in dict(cgi.FieldStorage()).iteritems()])
phone = TweetPhone(form.pop('user',''), form.pop('pass',''))
print phone.call(form.pop('method'), form)
