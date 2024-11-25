Todo Uygulaması

Bu depo, hem back-end (FastAPI) hem de front-end (React) bileşenleriyle tam yığın bir Todo Uygulaması içermektedir. Aşağıda, projeyi yerel olarak çalıştırmak için adımları bulabilirsiniz.

Gereksinimler

Makinenizde aşağıdakilerin kurulu olduğundan emin olun:

Node.js (v14 veya üzeri)

npm veya yarn

Python (v3.9 veya üzeri)

virtualenv (sanal ortam oluşturmak için)

Proje Yapısı

Depo iki ana klasör içermektedir:

fastapi-todo: Back-end kodlarını (FastAPI) içerir.

todo-frontend: Front-end kodlarını (React) içerir.

Başlarken

Back-End Kurulumu (FastAPI)

Back-end dizinine gidin:

cd fastapi-todo

Sanal bir ortam oluşturun:

python -m venv fastapi_env

Sanal ortamı etkinleştirin:

Windows'ta:

.\fastapi_env\Scripts\activate

macOS/Linux'ta:

source fastapi_env/bin/activate

Gerekli bağımlılıkları yükleyin:

pip install -r requirements.txt

FastAPI sunucusunu çalıştırın:

uvicorn main:app --reload

Back-end http://localhost:8000 adresinde çalışacaktır.

Front-End Kurulumu (React)

Front-end dizinine gidin:

cd ../todo-frontend

Gerekli bağımlılıkları yükleyin:

npm install

veya yarn kullanıyorsanız:

yarn install

Geliştirme sunucusunu başlatın:

npm start

veya yarn kullanıyorsanız:

yarn start

Front-end http://localhost:3000 adresinde çalışacaktır.

Uygulamayı Çalıştırma

Hem back-end hem de front-end sunucularının aynı anda çalıştığından emin olun.

Uygulamaya tarayıcınızda http://localhost:3000 adresine giderek erişebilirsiniz.

Önemli Notlar

FastAPI back-end'te CORS'un React front-end'ten gelen istekleri kabul edecek şekilde yapılandırıldığından emin olun (varsayılan olarak http://localhost:3000 olarak ayarlanmıştır).


Windows'a düzgün ve stabil bir Sql kuramadığım ve Sql kurulumunu anlatmak (windows genelinde normalden çok zor sql kurmak, ubuntu kullanınca direkt kullanıyorum ama kişisel bilgisayarım windows) bundan dolayı sql için .json kullandım back-end'de o da db sonuçta söz ikinci bir bilgisayarım olunca içine ubuntu kurup sql kullanan bir repository yayınlayacağım.




Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için LICENSE dosyasına bakınız.
