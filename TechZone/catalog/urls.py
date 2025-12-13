from django.urls import path
from . import views

urlpatterns = [
    path('', views.catalog, name='catalog'),

    path('mobile', views.mobile, name='catalog_mobile'),
    path('notebook', views.notebook, name='catalog_notebook'),
    path('TV', views.TV, name='catalog_TV'),
    path('headphones', views.headphones, name='catalog_headphones'),
    path('games', views.games, name='catalog_games'),
    path('photography', views.photography, name='catalog_photography'),

    path('apple', views.apple, name='catalog_apple'),
    path('samsung', views.samsung, name='catalog_samsung'),
    path('sony', views.sony, name='catalog_sony'),
    path('xiaomi', views.xiaomi, name='catalog_xiaomi'),
    path('asus', views.asus, name='catalog_asus'),
    path('lg', views.lg, name='catalog_lg'),

]