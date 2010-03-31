import urllib, urllib2, base64

class TweetPhone(object):
	"""A skin-tight library for Twitter's REST API"""
	api_base = 'http://api.twitter.com/1/'

	def __init__(self, user, passw, default_format='json'):
		self.default_format = default_format
		self.headers = {
		    'Authorization' : 'Basic ' + base64.b64encode(user + ':' + passw)
		}

	def call(self, method, data=None, format=None):
		""" E.g., TweetPhone().call('statuses/home_timeline') will return the user's home timeline as JSON. """
		format = format or self.default_format
		if data:
			data = urllib.urlencode(data)
		else:
			data = None
		req = urllib2.Request(self.api_base + method + '.' + format, data, self.headers)
		try:
			response = urllib2.urlopen(req)
		except Exception, e:
			return str(e)
		return response.read()
