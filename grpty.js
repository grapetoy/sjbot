function koreaDateTime(){
    // 1. 현재 시간(Locale)
    const curr = new Date();

    // 2. UTC 시간 계산
    const utc = 
          curr.getTime() + 
          (curr.getTimezoneOffset() * 60 * 1000);

    // 3. UTC to KST (UTC + 9시간)
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;  //한국 시간(KST)은 UTC시간보다 9시간 더 빠르므로 9시간을 밀리초 단위로 변환.
    const kr_curr = new Date(utc + (KR_TIME_DIFF));  //UTC 시간을 한국 시간으로 변환하기 위해 utc 밀리초 값에 9시간을 더함.

    return kr_curr;
}

module.exports = {
    koreaDateTime:koreaDateTime
};