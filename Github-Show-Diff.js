// ==UserScript==
// @namespace     https://openuserjs.org/users/HappyCtest
// @name          Github-Show-Diff
// @description   用于比较Github任意两个Commit之间的差异，用Github漂亮直观的方式展现出来。 A tool to compare arbitary two commits on Github, and present the differences in a beautiful and intuitive way.
// @copyright     2020, HappyCtest (https://openuserjs.org/users/HappyCtest)
// @license       MIT
// @version       0.1.0
// @include       http://github.com/*/*/commits/*
// @include       https://github.com/*/*/commits/*
// @grant         none
// @author        HappyCtest
// ==/UserScript==

// ==OpenUserJS==
// @author HappyCtest
// ==/OpenUserJS==

// Variables in the page
var all_items = [];
var selected_items = [];

var selected_icon = "☑";
var unselected_icon = "☐";

// Show selecting buttons.
function showSelectBtns(copy_btn_groups) {
    var num_groups = copy_btn_groups.length;
    all_items = [];
    for (var i = 0; i < num_groups; i++) {
        var copy_btn = copy_btn_groups[i];
        var hash_id = copy_btn.getAttribute("value").slice(0, 7);
        var commit_btn_group = copy_btn.parentNode;
        var btn_block = generateSelectBtn(hash_id);
        commit_btn_group.insertBefore(btn_block, copy_btn);
        all_items.push(hash_id);
    }
}

function createCompareBtn() {
    var branch_select_button = document.getElementById("branch-select-menu");
    var file_navigation_bar = branch_select_button.parentNode;

    var compare_btn_block = document.createElement("compare_btn_block");
    compare_btn_block.setAttribute("class", "details-reset details-overlay branch-select-menu ");
    compare_btn_block.setAttribute("id", "compare-btn-block");
    compare_btn_block.style.visibility = "hidden";
    compare_btn_block.onclick = function() {
        jumpToComparePage();
    }

    var compare_btn = document.createElement("compare_btn");
    compare_btn.setAttribute("class", "btn btn-sm css-truncate");
    compare_btn.setAttribute("role", "button");
    compare_btn.innerHTML = "<i>Compare</i>";
    compare_btn_block.appendChild(compare_btn);

    file_navigation_bar.appendChild(compare_btn_block);
}

function switchCompareBtnVisibility(visibility) {
    var compare_btn_block = document.getElementById("compare-btn-block");
    compare_btn_block.style.visibility = visibility;
}

function jumpToComparePage() {
    var repo_url = "";
    var metaList = document.getElementsByTagName("meta");
    for (var i = 0; i < metaList.length; i++) {
        if (metaList[i].getAttribute("property") == "og:url") {
            repo_url = metaList[i].content;
        }
    }
    hash1 = selected_items[0];
    hash2 = selected_items[1];
    console.log(hash1, hash2);
    idx1 = all_items.indexOf(hash1);
    idx2 = all_items.indexOf(hash2);
    var tail_link = "";
    if (idx1 < idx2) {
        tail_link = "/compare/" + hash2 + "..." + hash1;
    } else {
        tail_link = "/compare/" + hash1 + "..." + hash2;
    }
    var des_page = repo_url + tail_link;
    window.open(des_page);
}

function processClick(hash_id) {
    var btn_block = document.getElementById("select-" + hash_id);

    var btn_idx = selected_items.indexOf(hash_id);
    var num_selected = selected_items.length;
    if (btn_idx == -1) {
        // the btn is not selected
        if (num_selected > 1) {
            var hash_to_be_removed = selected_items[0];
            var btn_to_be_removed = document.getElementById("select-" + hash_to_be_removed);
            selected_items.splice(0, 1);
            setBtnState(btn_to_be_removed, unselected_icon);
        }
        selected_items.push(hash_id);
        setBtnState(btn_block, selected_icon);
        num_selected = selected_items.length;
        if (num_selected == 2) {
            switchCompareBtnVisibility('visible');
        }
    } else {
        // the btn is selected
        selected_items.splice(btn_idx, 1);
        setBtnState(btn_block, unselected_icon);
        switchCompareBtnVisibility('hidden');
    }
}

function setBtnState(btn_group_obj, select_state) {
    btn_group_obj.innerText = select_state;
}

// Generate the button element.
function generateSelectBtn(hash_id) {
    var btn_block = document.createElement("diff-select");
    btn_block.setAttribute("class", "btn btn-outline BtnGroup-item");
    btn_block.setAttribute("tabindex", "0");
    btn_block.setAttribute("role", "button");
    btn_block.setAttribute("commit_hash", hash_id);
    btn_block.setAttribute("id", "select-" + hash_id);
    btn_block.onclick=function() {
        processClick(btn_block.getAttribute("commit_hash"));
    };
    var btn_text_node = document.createTextNode(unselected_icon);
    btn_block.append(btn_text_node);
    return btn_block;
}

createCompareBtn();
var copy_btn_groups = document.getElementsByTagName("clipboard-copy");
showSelectBtns(copy_btn_groups);

