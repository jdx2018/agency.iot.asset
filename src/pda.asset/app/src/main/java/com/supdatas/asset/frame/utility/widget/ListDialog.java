/*******************************************************************************
 * Copyright (c) 2003-2017 青岛海信智能商用系统股份有限公司 版权所有
 ******************************************************************************/

package com.supdatas.asset.frame.utility.widget;

import android.app.Dialog;
import android.content.Context;
import android.support.annotation.ArrayRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.StringRes;
import android.support.v7.widget.CardView;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import com.supdatas.asset.R;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import butterknife.ButterKnife;

/**
 * 列表弹窗
 *
 * @author  2020
 */
public class ListDialog extends Dialog {

    private ListDialog mListDialog;
    private Context mContext;
    private LayoutInflater mInflater;
    private OnCancelListener mCancelListener;
    private boolean mCancelable = true;

    private View mParentView;
    private TextView mTextTitle;
    private RecyclerView mRecyclerView;


    /**
     * 列表弹窗构造方法
     *
     * @param context 上下文对象
     * @author guanguangjin 2017-10-29
     */
    public ListDialog(@NonNull Context context) {
        super(context, R.style.Dialog);
        this.init(context);
    }

    /**
     * 初始化列表弹出
     *
     * @author guanguangjin 2017-10-29
     */
    private void init(Context context) {
        this.mContext = context;
        mListDialog = this;
        mInflater = LayoutInflater.from(mContext);

        // Dialog视图
        mParentView = mInflater.inflate(R.layout.dialog_single_choice_list, null);
        mParentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (mCancelable) {
                    if (mCancelListener != null) {
                        mCancelListener.onCancel(mListDialog);
                    }

                    dismiss();
                }
            }
        });

        // 卡片内容区域
        CardView cardView = ButterKnife.findById(mParentView, R.id.cardv_dialog_list_container);
        cardView.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                return true;
            }
        });

        // 列表
        mRecyclerView = ButterKnife.findById(mParentView, R.id.list_dialog_single_choice);

        // 标题
        mTextTitle = ButterKnife.findById(mParentView, R.id.text_list_dialog_title);
    }

    /**
     * 根据资源ID设置弹窗标题
     *
     * @param resId 资源ID
     * @author guanguangjin 2017-10-29
     */
    @Override
    public void setTitle(@StringRes int resId) {
        this.setTitle(mContext.getText(resId));
    }

    /**
     * 根据字符串设置弹窗标题
     *
     * @param title 标题文本
     * @author guanguangjin 2017-10-29
     */
    @Override
    public void setTitle(CharSequence title) {
        mTextTitle.setText(title);
    }

    /**
     * 是否可以取消弹窗显示（点击阴影、返回键）
     *
     * @param flag 是否可以取消。 True：可以取消。 False：不可以取消
     * @author guanguangjin 2017-10-29
     */
    @Override
    public void setCancelable(boolean flag) {
        super.setCancelable(flag);
        mCancelable = flag;
    }

    /**
     * 设置弹窗取消时的监听器
     *
     * @param listener 监听器对象
     * @author guanguangjin 2017-10-29
     */
    @Override
    public void setOnCancelListener(@Nullable OnCancelListener listener) {
        super.setOnCancelListener(listener);
        mCancelListener = listener;
    }

    /**
     * 根据资源iD设置弹窗单选列表
     *
     * @param resId       资源ID
     * @param checkedItem 默认选中项
     * @param listener    监听器
     * @author guanguangjin 2017-10-29
     */
    public void setSingleChoiceItems(@ArrayRes int resId, int checkedItem,
                                     final OnItemClickListener listener) {
        String[] items = mContext.getResources().getStringArray(resId);
        this.setSingleChoiceItems(items, checkedItem, listener);
    }

    /**
     * 根据资源iD设置弹窗单选列表
     *
     * @param items       字符串数组
     * @param checkedItem 默认选中项
     * @param listener    监听器
     * @author guanguangjin 2017-10-29
     */
    public void setSingleChoiceItems(CharSequence[] items, int checkedItem,
                                     final OnItemClickListener listener) {
        this.setSingleChoiceItems(Arrays.asList(items), checkedItem, listener);
    }

    /**
     * 根据资源iD设置弹窗单选列表
     *
     * @param items       字符串列表
     * @param checkedItem 默认选中项
     * @param listener    监听器
     * @author guanguangjin 2017-10-29
     */
    public void setSingleChoiceItems(List<CharSequence> items, int checkedItem,
                                     final OnItemClickListener listener) {
        List<DialogListItem> listItems = new ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            listItems.add(new DialogListItem(i, items.get(i),
                    i == checkedItem, i + 1 != items.size()));
        }
        DialogListAdapter listAdapter = new DialogListAdapter(listItems, mContext);
        listAdapter.setOnItemClickListener(listener);
        mRecyclerView.setAdapter(listAdapter);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(mContext));
    }

    /**
     * 显示弹窗
     *
     * @author guanguangjin 2017-10-29
     */
    @Override
    public void show() {
        setContentView(mParentView);
        WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
        Window window = getWindow();
        layoutParams.copyFrom(window.getAttributes());
        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
        layoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
        window.setAttributes(layoutParams);
        super.show();
    }


    /**
     * Dialog 列表适配器
     *
     * @author guanguangjin 2017-10-29
     */
    private class DialogListAdapter extends RecyclerView.Adapter<DialogListItemHolder>
            implements View.OnClickListener {

        private List<DialogListItem> mItemList;
        private Context mContext;
        private LayoutInflater mInflater;

        private OnItemClickListener mOnItemClickListener;

        private DialogListItem mItem;

        /**
         * Dialog列表适配器构造函数
         *
         * @param itemList 数据集
         * @param context  上下文
         * @author guanguangjin 2017-10-29
         */
        DialogListAdapter(List<DialogListItem> itemList, Context context) {
            this.mItemList = itemList;
            this.mContext = context;
            this.mInflater = LayoutInflater.from(context);
        }

        /**
         * 创建列表项Holder对象
         *
         * @param parent   父视图
         * @param viewType 视图类型
         * @return 列表项ViewHolder实例
         * @author guanguangjin 2017-10-29
         */
        @Override
        public DialogListItemHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = mInflater.inflate(R.layout.item_dialog_single_choice, null);
            view.setOnClickListener(this);
            return new DialogListItemHolder(view);
        }

        /**
         * 为Holder绑定数据
         *
         * @param holder   ViewHolder实例视图
         * @param position 视图项索引
         * @author guanguangjin 2017-10-29
         */
        @Override
        public void onBindViewHolder(DialogListItemHolder holder, int position) {
            DialogListItem item = mItemList.get(position);
            holder.itemView.setTag(item);
            holder.bind(item);

            if (item.isChecked()) {
                mItem = item;
            }
        }

        /**
         * 列表项点击事件
         *
         * @param listener 监听器
         * @author guanguangjin 2017-10-29
         */
        void setOnItemClickListener(OnItemClickListener listener) {
            this.mOnItemClickListener = listener;
        }

        /**
         * 返回列表项个数
         *
         * @return 列表项个数
         * @author guanguangjin 2017-10-29
         */
        @Override
        public int getItemCount() {
            return mItemList == null ? 0 : mItemList.size();
        }

        /**
         * 列表项点击事件处理
         *
         * @param view 视图对象
         * @author guanguangjin 2017-10-29
         */
        @Override
        public void onClick(View view) {

            // 更新数据
            if (mItem != null) {
                mItem.setChecked(false);
            }

            mItem = (DialogListItem) view.getTag();
            mItem.setChecked(true);

            if (mOnItemClickListener != null) {
                mOnItemClickListener.onItemClick(view, mItem.getId());
            }

            /**
             * 如果需要点击列表后不隐藏弹窗，那么需要执行notifyDataSetChanged方法
             * 来通知列表刷新，显示点击后的项目。
             *
             * notifyDataSetChanged();
             */
            dismiss();
        }
    }

    /**
     * 列表项点击事件监听器。
     *
     * @author guanguangjin 2017-10-29
     */
    public interface OnItemClickListener {
        void onItemClick(View view, int position);
    }

    /**
     * Dialog列表项ViewHolder
     *
     * @author guanguangjin 2017-10-29
     */
    private class DialogListItemHolder extends RecyclerView.ViewHolder {

        private DialogListItem mItem;

        private ImageView mImgChecked;
        private TextView mTextContent;
        private TextView mTextDiv;

        /**
         * 创建ViewHolder实例
         *
         * @param itemView 列表项视图对象
         * @author guanguangjin 2017-10-29
         */
        DialogListItemHolder(View itemView) {
            super(itemView);
            mImgChecked = (ImageView) itemView.findViewById(R.id.img_item_checked);
            mTextContent = (TextView) itemView.findViewById(R.id.text_item_content);
            mTextDiv = (TextView) itemView.findViewById(R.id.text_item_div);
        }

        /**
         * 绑定ViewHolder数据
         *
         * @param item 数据项
         * @author guanguangjin 2017-10-29
         */
        public void bind(DialogListItem item) {
            this.mItem = item;
            mImgChecked.setVisibility(item.isChecked() ? View.VISIBLE : View.INVISIBLE);
            mTextDiv.setVisibility(item.isShowDiv() ? View.VISIBLE : View.INVISIBLE);
            mTextContent.setText(item.getItemContent());
        }
    }

    /**
     * Dialog列表数据项
     *
     * @author guanguangjin 2017-10-29
     */
    private class DialogListItem {

        private int id;
        private boolean checked;
        private boolean showDiv;
        private CharSequence itemContent;

        DialogListItem(int id, CharSequence itemContent, boolean checked, boolean showDiv) {
            this.id = id;
            this.checked = checked;
            this.showDiv = showDiv;
            this.itemContent = itemContent;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public boolean isChecked() {
            return checked;
        }

        public void setChecked(boolean checked) {
            this.checked = checked;
        }

        public CharSequence getItemContent() {
            return itemContent;
        }

        public void setItemContent(CharSequence itemContent) {
            this.itemContent = itemContent;
        }

        public boolean isShowDiv() {
            return showDiv;
        }

        public void setShowDiv(boolean showDiv) {
            this.showDiv = showDiv;
        }
    }
}
