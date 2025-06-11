// Cypress에서 제공하는 타입을 참조하여 코드 자동완성과 타입 체크를 활성화
/// <reference types="cypress" />

describe("로그인 페이지", () => {
  beforeEach(() => {
    // 테스트를 시작할 때마다 /login 페이지로 이동
    cy.visit("/login");
  });

  it("이메일과 비밀번호 입력 후 로그인 버튼 클릭하면 로그인 요청이 발생한다", () => {
    //get으로 부른 해당 input 창에 type("입력값") 입력값 입력
    cy.get('input[placeholder="이메일을 입력해주세요"]').type("yh@naver.com");
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').type("123qwe");
    cy.get('button[type="submit"]').click();

    // 로그인 후 메인 페이지로 이동했는지 URL 경로로 확인
    // "/"가 포함되어 있는지 확인함
    cy.url().should("include", "/");
  });

  it("이메일 또는 비밀번호가 없으면 alert 경고가 뜬다", () => {
    // 브라우저의 window 객체에 접근해서 alert 함수를 감시(stub)함
    // 나중에 alert이 실행됐는지, 어떤 메시지가 떴는지 확인할 수 있도록 설정
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });

    // 이메일 없이 비밀번호만 입력하고 제출
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').type("123qwe");
    cy.get('button[type="submit"]').click();

    // alert이 특정 인자[메시지("빈 칸을 확인하세요")]와 함께 실행됐는지 확인
    cy.get("@alertStub").should("have.been.calledWith", "빈 칸을 확인하세요");

    // 페이지 새로고침 (이전 입력값 초기화)
    cy.reload();

    // 비밀번호 없이 이메일만 입력하고 제출
    cy.get('input[placeholder="이메일을 입력해주세요"]').type("yh@naver.com");
    cy.get('button[type="submit"]').click();

    // 마찬가지로 alert 메시지 확인
    cy.get("@alertStub").should("have.been.calledWith", "빈 칸을 확인하세요");
  });

  it("엔터키 입력 시에도 로그인 요청이 발생한다", () => {
    cy.get('input[placeholder="이메일을 입력해주세요"]').type("yh@naver.com");

    // 비밀번호 입력 후 마지막에 엔터키 입력
    // 일반적으로 폼 제출(form submit)이 일어남

    cy.get('input[placeholder="비밀번호를 입력해주세요"]').type(
      "123qwe{enter}"
    );

    // 로그인 성공 후 URL에 "/"가 포함되어 있는지 확인
    cy.url().should("include", "/");
  });
});
