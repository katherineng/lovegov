from django.contrib.gis.db import models

class State(models.Model):
    region = models.IntegerField()
    division = models.IntegerField()
    statefp = models.IntegerField()
    geoid = models.IntegerField()
    stusps = models.CharField(max_length=2)
    name = models.CharField(max_length=50)
    lsad = models.IntegerField()
    mtfcc = models.CharField(max_length=10)
    funcstat = models.CharField(max_length=5)
    land = models.FloatField()
    water = models.FloatField()
    lat = models.FloatField()
    lon = models.FloatField()
    
    mpoly = models.MultiPolygonField()
    objects = models.GeoManager()
    
    def __unicode__(self):  # Python 3: def __str__(self):
        return self.name
