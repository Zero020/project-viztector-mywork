from requests import request
from requests.exceptions import HTTPError
from time import sleep
import re
import websockets
import asyncio
import json
import cv2
import numpy as np
import base64
import matplotlib.pyplot as plt
from io import BytesIO


ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0'

plt.rc('font', family='Malgun Gothic')
plt.rcParams['axes.unicode_minus'] = False

def download(url, params={}, data={}, headers={}, method='GET', retries=3):
    # if not canFetch(url, url):
    #     print('수집하면 안됨')
    
    resp = request(method, url, params=params, data=data, headers=headers)
    
    try:
        resp.raise_for_status()
    except HTTPError as e:
        if 499 < resp.status_code and retries > 0:
            print('재시도 중')
            sleep(5)
            return download(url, params, data, headers, method, retries-1)
        else:
            print(e.response.status_code)
            print(e.request.headers)
            print(e.response.headers)
        return None
        
    return resp
plt.rc('font', family='Malgun Gothic')
plt.rcParams['axes.unicode_minus'] = False


def generate_plot_image():
    # 데이터 생성
    x = np.linspace(0, 10, 100)
    y = np.sin(x)

    # 그래프 생성
    plt.figure()
    plt.plot(x, y)
    plt.title('예제 플롯')
    plt.xlabel('X 축')
    plt.ylabel('Y 축')
    plt.grid(True)

    # 이미지 데이터를 메모리 버퍼에 저장
    buf = BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)

    # 이미지 데이터를 Base64로 인코딩
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return img_str

def get_img(url):

    # url로 부터 이미지 데이터 다운
    resp = download(url, headers={'user-agent':ua})

    if resp is None:
        print("에러")
        
        return

    # 이미지 코드 일시 content 데이터 사용 아닐시 함수 종료
    if re.search(r'image\/(\w+);?', resp.headers['content-type']):
        # ext = re.search(r'image\/(\w+);?', resp.headers['content-type']).group(1)
        # fname = re.search(r'/(\w+\.jpg|jpeg|png|bmp|gif)', url).group(1)
        
        # 이미지 디코드
        img = np.fromstring(resp.content, dtype='uint8')
        img = cv2.imdecode(img,1)
        return img
    
    else:
        return

async def handler(websocket, path):
    try:
        # 데이터 수신
        data = await websocket.recv()
        data = json.loads(data)
        
        if data:
            if 'imageUrl' in data.keys() or 'image' in data.keys():
                # 임시 고정 이미지 데이터를 생성
                img_str = generate_plot_image()
                send_data = {
                    'is_dist': True,
                    'correctionMark': img_str,
                    'correctionCopy': img_str
                }
                await asyncio.sleep(3)  # 3초 지연- 테스트용

                await websocket.send(json.dumps(send_data))
            else:
                print('Invalid data received')
                await websocket.send(json.dumps({'error': 'Invalid data'}))
        else:
            print('데이터 비어있음')
            await websocket.send(json.dumps({'error': 'Empty data'}))
            
    except websockets.ConnectionClosedOK:
        pass

    await websocket.close()


    try:
        # 데이터 수신
        data = await websocket.recv()
        data = json.loads(data)
        
        if data:
            if 'imageUrl' in data.keys():
                url = data['imageUrl']
                img = get_img(url)
                
                if img is None:
                    print('이미지아님')
                    await websocket.send(json.dumps('이미지아님'))
                else:
                    is_dist = True
                    img =  base64.b64encode(img)

                    send_data = {'is_dist':is_dist,
                                'correctionMark':img.decode(),
                                'correctionCopy':img.decode()}
                    await websocket.send(json.dumps(send_data))
                    
            elif 'image' in data.keys():
                
                img = np.fromstring(base64.b64decode(re.sub('data:image/jpeg;base64,','',data['image'])), dtype='uint8')
                img = cv2.imdecode(img,1)
                
                if img is None:
                    print('이미지아님')
                    await websocket.send(json.dumps('이미지아님'))
                else:
                    is_dist = True
                    plot_img2 =  base64.b64encode(plot_img2)
                    send_data = {'is_dist':is_dist,
                                'correctionMark':img.decode(),
                                'correctionCopy':img.decode()}
                await websocket.send(json.dumps(send_data))
        else:
            print('데이터 비어있음')
            
    except websockets.ConnectionClosedOK:
        pass

    await websocket.close()


# 서버 시작
async def main(HOST, PORT):
    async with websockets.serve(handler, HOST, PORT, max_size=2**23):
        await asyncio.Future()  # run forever
        
if __name__ == "__main__":
    HOST = '127.0.0.1'
    PORT = 8080

    print('>> Server Start with IP:', HOST)

    asyncio.run(main(HOST, PORT))


